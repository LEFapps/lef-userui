# lef-userui

Creates a dropdown menu to be used in a Bootstrap navbar for user actions (login, logout, forgot password, register).

## Usage

Optionally set the `profileUrl` and the `registerUrl` (defaults to `/register`).

```JSX
import UserMenu from 'meteor/lef:userui'

<UserMenu profileUrl='/profile' registerUrl='/register' />
```

## Todo

- Password reset mail using `lef:systemmailing`