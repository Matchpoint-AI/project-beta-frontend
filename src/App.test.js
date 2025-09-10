import { jsx as _jsx } from 'react/jsx-runtime';
import { render, screen } from '@testing-library/react';
import App from './App';
test('renders learn react link', function () {
  render(_jsx(App, {}));
  var linkElement = screen.getByText(/Product/i);
  expect(linkElement).toBeInTheDocument();
});
//# sourceMappingURL=App.test.js.map
