import { TstPage } from './app.po';

describe('tst App', () => {
  let page: TstPage;

  beforeEach(() => {
    page = new TstPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
