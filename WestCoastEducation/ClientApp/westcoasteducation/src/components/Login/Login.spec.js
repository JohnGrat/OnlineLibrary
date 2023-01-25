import React from 'react';
import { mount } from 'enzyme';

import Login from './Login';

describe('Login component', () => {
    it('should match snapshot', () => {
        expect(mount(<Login />)).toMatchSnapshot();
    });
});
