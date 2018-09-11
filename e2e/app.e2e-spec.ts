import { HsjcEduTemplatePage } from './app.po';

describe('HsjcEdu App', function() {
  let page: HsjcEduTemplatePage;

  beforeEach(() => {
    page = new HsjcEduTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
