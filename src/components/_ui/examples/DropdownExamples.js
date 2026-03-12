import Dropdown from '../../natura11y/dropdown';

const DropdownExamples = () => {
    return (
        <div className="container narrow margin-x-auto grid gap-4">

            <div>
                <p className="h6 margin-bottom-2">Horizontal Nav with Dropdown</p>
                <ul className="nav nav--horizontal--md">
                    <li>
                        <Dropdown buttonText="Dropdown" hover>
                            <li><a href="#1">Link</a></li>
                            <li><a href="#1">Link</a></li>
                            <li><a href="#1">Link</a></li>
                        </Dropdown>
                    </li>
                    <li><a href="#1">Link</a></li>
                    <li><a href="#1">Link</a></li>
                </ul>
            </div>

            <div>
                <p className="h6 margin-bottom-2">Vertical Nav with Dropdown</p>
                <ul className="nav nav--divider">
                    <li>
                        <Dropdown buttonText="Dropdown">
                            <li><a href="#1">Link</a></li>
                            <li><a href="#1">Link</a></li>
                            <li><a href="#1">Link</a></li>
                        </Dropdown>
                    </li>
                    <li><a href="#1">Link</a></li>
                    <li><a href="#1">Link</a></li>
                </ul>
            </div>

            <div>
                <p className="h6 margin-bottom-2">Link Split</p>
                <ul className="nav nav--horizontal--md">
                    <li>
                        <Dropdown linkSplit linkText="Page" linkHref="#1">
                            <li><a href="#1">Link</a></li>
                            <li><a href="#1">Link</a></li>
                            <li><a href="#1">Link</a></li>
                        </Dropdown>
                    </li>
                    <li><a href="#1">Link</a></li>
                    <li><a href="#1">Link</a></li>
                </ul>
            </div>

        </div>
    );
};

export default DropdownExamples;