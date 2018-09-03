import React, { Component } from 'react'
import { Translate } from 'meteor/lef:translations'
import { Meteor } from 'meteor/meteor'
import {
  Form,
  FormGroup,
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
import { faUser } from '@fortawesome/free-solid-svg-icons'
import fontawesome from '@fortawesome/fontawesome'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Accounts } from 'meteor/accounts-base'
import { withTracker } from 'meteor/react-meteor-data'

fontawesome.library.add(faUser)

class LoginForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      error: ''
    }
    this._onSubmit = this._onSubmit.bind(this)
  }
  _onSubmit (e) {
    e.preventDefault()
    const { email, password } = this.state
    Meteor.loginWithPassword(email, password, error => {
      if (error) {
        this.setState({ error: error.reason })
        setTimeout(() => this.setState({ error: '' }), 5000)
      }
    })
  }
  render () {
    return (
      <Form onSubmit={this._onSubmit}>
        {this.state.error
          ? <Alert color='warning'>{this.state.error}</Alert>
          : null}
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
          <Input
            type='password'
            name='password'
            onChange={e => this.setState({ password: e.target.value })}
          />
        </FormGroup>
        <Button type='submit'><Translate _id='log_in' /></Button>
        <p>
          <Link to={this.props.registerUrl}>
            <Translate _id='no_account?_please_register' />
          </Link><br />
          <a href='#' onClick={this.props._toggleResetPassword}>
            <Translate _id='forgot_password?' />
          </a>
        </p>
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
  _onSubmit () {
    const { email } = this.state
    Accounts.forgotPassword(email)
  }
  render () {
    return (
      <Form onSubmit={this._onSubmit}>
        <FormGroup>
          <Label>
            <Translate _id='email' />
          </Label>
          <Input type='email' name='email' />
        </FormGroup>
        <Button type='submit'><Translate _id='reset_password' /></Button>
        <a href='#' onClick={this.props._toggleResetPassword}>
          <Translate _id='cancel' />
        </a>
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
    return this.state.resetPasswordOpen
      ? <ForgotPasswordForm _toggleResetPassword={this._toggleResetPassword} />
      : <LoginForm
        {...this.props}
        _toggleResetPassword={this._toggleResetPassword}
      />
  }
}

const User = ({ profileUrl }) => {
  return (
    <div>
      {profileUrl
        ? <Link to={profileUrl} className='dropdown-item'>
          <Translate _id='user_profile' />
        </Link>
        : null}
      <DropdownItem href='#' onClick={() => Meteor.logout()}>
        <Translate _id='sign_out' />
      </DropdownItem>
    </div>
  )
}

const UserMenu = props => {
  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        <FontAwesomeIcon icon='user' />
      </DropdownToggle>
      <DropdownMenu right>
        {props.user
          ? <User {...props} />
          : <ToggleLoginResetPassword {...props} />}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

UserMenu.defaultProps = {
  registerUrl: '/register'
}

UserMenu.propTypes = {
  registerUrl: PropTypes.string,
  profileUrl: PropTypes.string
}

const UserMenuContainer = withTracker(() => {
  return {
    user: Meteor.user()
  }
})(UserMenu)

export default UserMenuContainer