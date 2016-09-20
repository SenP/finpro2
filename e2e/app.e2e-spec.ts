import { Finpro3Page } from './app.po';

describe('finpro3 App', function() {
  let page: Finpro3Page;

  beforeEach(() => {
    page = new Finpro3Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
