import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import Login from './Login';

storiesOf('Login', module)
    .add('with title', withInfo()(() => (
        <Login title="Login title" />
    )));
