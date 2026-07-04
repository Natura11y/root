import MainMenu from '@lib/components/main-menu';
import Dropdown from '@lib/components/dropdown';
import Brand from '@lib/components/main-menu/Brand';
import FormEntrySearch from '@lib/components/form/FormEntrySearch';

const logo = (
    <a href="/" title="Home" data-logo="brand">
        <Brand />
    </a>
);

const searchBar = (
    <FormEntrySearch
        id='main-menu-search-bar'
        name='globalSearch'
        leadingIcon={false}
        submitButton='text'
    />
);

const searchStack = (
    <FormEntrySearch
        id='main-menu-search-stack'
        name='globalSearch'
        leadingIcon={false}
        submitButton='icon'
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
                <MainMenu logo={logo} search={searchBar}>
                    {navItems}
                </MainMenu>
            </div>

            <div className="box-shadow-1">
                <p className="h6 padding-x-3 padding-top-3 margin-bottom-2">Stack</p>
                <MainMenu variant="stack" logo={logo} search={searchStack}>
                    {navItems}
                </MainMenu>
            </div>

        </div>
    );
};

export default MainMenuExamples;