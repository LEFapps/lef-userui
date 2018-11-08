# lef-userui

Creates a dropdown menu to be used in a Bootstrap navbar for user actions (login, logout, forgot password, register).

## Usage

Optionally set the `profileUrl`, `userNamePath` and the `registerUrl` (defaults to `/register`). Put a route in your app to handle the `/reset-password` request.

```JSX
import UserMenu, { ResetPasswordForm } from 'meteor/lef:userui'

<UserMenu profileUrl='/profile' registerUrl='/register' userNamePath='profile.name' />

<Route exact path='/reset-password/:token' component={ResetPasswordForm} />
```

## Todo

- Password reset mail using `lef:systemmailing`