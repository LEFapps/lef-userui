import React, { Component, useState } from 'react'
import { Translate } from 'meteor/lef:translations'
import { Meteor } from 'meteor/meteor'
import {
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Alert
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import { Accounts } from 'meteor/accounts-base'
import { withTracker } from 'meteor/react-meteor-data'
import { NewAlert } from 'meteor/lef:alerts'
import get from 'lodash/get'

const minLength = 6

class LoginForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      error: null,
      type: 'password'
    }
    this.toggleVisibility = this.toggleVisibility.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }
  _onSubmit (e) {
    e.preventDefault()
    const { email, password } = this.state
    Meteor.loginWithPassword(email, password, error => {
      if (error) {
        console.error(error)
        this.setState({
          error: (
            <Translate
              _id={`error/loginWithPassword/${error.error}`}
              params={error}
              category={'error'}
            />
          )
        })
        setTimeout(() => this.setState({ error: null }), 5000)
      }
    })
  }
  toggleVisibility () {
    this.setState({
      type: this.state.type === 'text' ? 'password' : 'text'
    })
  }

  render () {
    return (
      <Form onSubmit={this._onSubmit}>
        {this.state.error ? (
          <Alert color='warning'>{this.state.error}</Alert>
        ) : null}
        <FormGroup>
          <Label>
            <Translate _id='email' />
          </Label>
          <Input
            type='email'
            name='email'
            onChange={e => this.setState({ email: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label>
            <Translate _id='password' />
          </Label>
          <div className='input-wrapper'>
            <Input
              type={this.state.type}
              name='password'
              onChange={e => this.setState({ password: e.target.value })}
            />
            <span onClick={this.toggleVisibility} className='errspan'>
              {this.state.type === 'text' ? (
                <FontAwesomeIcon icon='eye-slash' className='icon' />
              ) : (
                <FontAwesomeIcon icon='eye' className='icon' />
              )}
            </span>
          </div>
        </FormGroup>
        <Button type='submit'>
          <Translate _id='log_in' />
        </Button>
        <div className={'my-3'}>
          {this.props.noRegistration ? null : (
            <Link to={this.props.registerUrl}>
              <Translate _id='no_account?_please_register' />
            </Link>
          )}
        </div>
        <div className={'my-3'}>
          <a href='#' onClick={this.props._toggleResetPassword}>
            <Translate _id='forgot_password?' />
          </a>
        </div>
      </Form>
    )
  }
}

class ForgotPasswordForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: ''
    }
    this._onSubmit = this._onSubmit.bind(this)
  }
  _onSubmit (e) {
    e.preventDefault()
    Accounts.forgotPassword(this.state, error => {
      this.props._toggleResetPassword()
      if (error) {
        NewAlert({
          translate: `error/forgotPassword/${error.error}`,
          type: 'danger',
          delay: 0
        })
        console.error(error)
      } else {
        NewAlert({
          translate: 'an_email_has_been_send_to_reset_password',
          type: 'success'
        })
      }
    })
  }
  render () {
    return (
      <Form onSubmit={this._onSubmit}>
        <FormGroup>
          <Label>
            <Translate _id='email' />
          </Label>
          <Input
            type='email'
            name='email'
            onChange={e => this.setState({ email: e.target.value })}
          />
        </FormGroup>
        <Button type='submit'>
          <Translate _id='reset_password' />
        </Button>
        <div className={'my-3'}>
          <a href='#' onClick={this.props._toggleResetPassword}>
            <Translate _id='cancel' />
          </a>
        </div>
      </Form>
    )
  }
}

class ResetPasswordForm extends Component {
  constructor (props) {
    super(props)
    this.state = { password: '', repeat_password: '' }
    this._onSubmit = this._onSubmit.bind(this)
  }
  _onSubmit (e) {
    e.preventDefault()
    Accounts.resetPassword(
      this.props.match.params.token,
      this.state.password,
      error => {
        if (error) {
          NewAlert({
            translate: `error/resetPassword/${error.error}`,
            type: 'danger'
          })
          console.error(error)
        } else {
          NewAlert({
            translate: 'password_successfully_reset',
            type: 'success'
          })
          this.props.history.push('/')
        }
      }
    )
  }
  render () {
    return (
      <Form onSubmit={this._onSubmit}>
        <FormGroup>
          <Label>
            <Translate _id='password' />
          </Label>
          <Input
            type='password'
            name='password'
            onChange={e => this.setState({ password: e.target.value })}
          />
          <FormText color={'muted'}>
            {`Min. ${minLength} tekens/characters.`}
          </FormText>
        </FormGroup>
        <FormGroup>
          <Label>
            <Translate _id='repeat_password' />
          </Label>
          <Input
            type='password'
            name='repeat_password'
            onChange={e => this.setState({ repeat_password: e.target.value })}
          />
        </FormGroup>
        <Button
          type='submit'
          color='success'
          disabled={
            this.state.password.length >= minLength
              ? this.state.password !== this.state.repeat_password
              : true
          }
        >
          <Translate _id='reset_password' />
        </Button>
      </Form>
    )
  }
}

class ToggleLoginResetPassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      resetPasswordOpen: false
    }
    this._toggleResetPassword = this._toggleResetPassword.bind(this)
  }
  _toggleResetPassword () {
    this.setState({
      resetPasswordOpen: !this.state.resetPasswordOpen
    })
  }
  render () {
    return this.state.resetPasswordOpen ? (
      <ForgotPasswordForm _toggleResetPassword={this._toggleResetPassword} />
    ) : (
      <LoginForm
        {...this.props}
        _toggleResetPassword={this._toggleResetPassword}
      />
    )
  }
}

const User = withRouter(
  ({ profileUrl, history, user, userNamePath, children }) => {
    const userName = get(user, userNamePath)
    return (
      <div>
        <Link to={profileUrl || '#'} className='dropdown-item'>
          {userName ? (
            <span>
              <Translate _id='welcome' />, {userName}
            </span>
          ) : (
            <Translate _id='user_profile' />
          )}
        </Link>
        {children || null}
        <DropdownItem
          href='#'
          onClick={() => {
            Meteor.logout()
            history.push('/')
          }}
        >
          <Translate _id='sign_out' />
        </DropdownItem>
      </div>
    )
  }
)

const UserMenu = props => {
  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        <FontAwesomeIcon icon='user' />
      </DropdownToggle>
      <DropdownMenu right>
        {props.user ? (
          <User {...props} />
        ) : (
          <div className={'dropdown-header ' + (props.dropdownClassName || '')}>
            <ToggleLoginResetPassword {...props} />
          </div>
        )}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

UserMenu.defaultProps = {
  registerUrl: '/register'
}

UserMenu.propTypes = {
  registerUrl: PropTypes.string,
  profileUrl: PropTypes.string,
  noRegistration: PropTypes.bool
}

const UserMenuContainer = withTracker(() => {
  return {
    user: Meteor.user()
  }
})(UserMenu)

const VerifyEmailRoute = ({
  match: {
    params: { token }
  },
  history: { push }
}) => {
  const [busy, setBusy] = useState(false)
  if (!busy) {
    setBusy(true)
    Accounts.verifyEmail(token, (error, result) => {
      push('/')
      setBusy(false)
      if (result) {
        NewAlert({ translate: 'email_successfully_verified', type: 'success' })
      } else {
        NewAlert({
          translate: `error/verifyEmail/${error.error}`,
          type: 'danger'
        })
        console.error(error)
      }
    })
  }
  return <Alert color='info'>Verifying email...</Alert>
}

export default UserMenuContainer
export { ResetPasswordForm, VerifyEmailRoute }
