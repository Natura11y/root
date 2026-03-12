import MainMenu from '../../natura11y/main-menu';
import Dropdown from '../../natura11y/dropdown';
import Brand from '../../natura11y/main-menu/Brand';
import FormEntry from '../../natura11y/form/FormEntry';

const logo = (
    <a href="/" title="Home" data-logo="brand">
        <Brand />
    </a>
);

const search = (
    <FormEntry
        entryType="search"
        entryName="global-search"
        labelText="Search"
        labelVisible={false}
        buttonLabel="Search"
    />
);

const navItems = (
    <>
        <li>
            <Dropdown buttonText="Dropdown" hover utilities="box-shadow-1--lg">
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
        <div className="container wide grid gap-4">

            <div className="box-shadow-1">
                <p className="h6 padding-x-3 padding-top-3 margin-bottom-2">Bar</p>
                <MainMenu logo={logo} search={search}>
                    {navItems}
                </MainMenu>
            </div>

            <div className="box-shadow-1">
                <p className="h6 padding-x-3 padding-top-3 margin-bottom-2">Stack</p>
                <MainMenu variant="stack" logo={logo} search={search}>
                    {navItems}
                </MainMenu>
            </div>

        </div>
    );
};

export default MainMenuExamples;