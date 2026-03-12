import Card from '../../natura11y/card';

const CardExamples = () => (
    <div className='container medium margin-x-auto grid gap-4'>

        <div className='grid grid--column-3--md gap-4'>

            <Card utilities='theme-canvas border'>
                <Card.Head>Category</Card.Head>
                <Card.Body>
                    <h3 className='h5'>Card Title</h3>
                    <p>Card body content goes here with supporting text.</p>
                </Card.Body>
                <Card.Foot>
                    <a className='button button--outline' href='#1'>Learn more</a>
                </Card.Foot>
            </Card>

            <Card utilities='theme-primary'>
                <Card.Body>
                    <h3 className='h5'>Primary Theme</h3>
                    <p>Card with a primary theme applied.</p>
                </Card.Body>
                <Card.Foot>
                    <a className='button' href='#1'>Action</a>
                </Card.Foot>
            </Card>

            <Card utilities='theme-canvas border'>
                <Card.Body>
                    <h3 className='h5'>Body Only</h3>
                    <p>A simple card with just a body section.</p>
                </Card.Body>
            </Card>

        </div>

        <Card horizontal utilities='theme-canvas border'>
            <Card.Media>
                <img src='https://placehold.co/600x300' alt='' />
            </Card.Media>
            <Card.Head>Category</Card.Head>
            <Card.Body>
                <h3 className='h5'>Horizontal Card</h3>
                <p>Media on the left, content on the right.</p>
            </Card.Body>
            <Card.Foot>
                <a className='button button--outline' href='#1'>Learn more</a>
            </Card.Foot>
        </Card>

    </div>
);

export default CardExamples;
