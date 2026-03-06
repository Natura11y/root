import MainMenu from '../../natura11y/main-menu';
import Dropdown from '../../natura11y/navigation/Dropdown';
import Brand from '../../natura11y/navigation/Brand';

const logo = (
    <a href="/" title="Home" data-logo="brand">
        <Brand />
    </a>
);

const search = (
    <div className="form-entry" aria-label="Search">
        <div className="form-entry__field">
            <span className="form-entry__field__input">
                <input type="text" name="global-search" placeholder="Search..." />
                <button className="button">Search</button>
            </span>
        </div>
    </div>
);

const navItems = (
    <>
        <li>
            <Dropdown buttonText="Dropdown" hover>
                <li><a href="#1">Link</a></li>
                <li><a href="#1">Link</a></li>
                <li><a href="#1">Link</a></li>
            </Dropdown>
        </li>
        <li><a href="#1">Link</a></li>
        <li><a href="#1">Link</a></li>
    </>
);

const MainMenuExamples = () => {
    return (
        <div className="grid gap-4">
            <div>
                <p className="h6 container padding-x-3 margin-bottom-2">Bar</p>
                <MainMenu logo={logo} search={search}>
                    {navItems}
                </MainMenu>
            </div>
            <div>
                <p className="h6 container padding-x-3 margin-bottom-2">Stack</p>
                <MainMenu variant="stack" logo={logo} search={search}>
                    {navItems}
                </MainMenu>
            </div>
        </div>
    );
};

export default MainMenuExamples;
