import Track from '../../natura11y/track';

const TrackExamples = () => {
	const panels = [
		{
			imageUrl: 'https://placehold.co/1500x750?text=One',
			altText: 'Placeholder Image One',
			buttonText: 'Button Label 1',
			linkUrl: '#1',
		},
		{
			imageUrl: 'https://placehold.co/1500x750?text=Two',
			altText: 'Placeholder Image Two',
			buttonText: 'Button Label 2',
			linkUrl: '#2',
		},
		{
			imageUrl: 'https://placehold.co/1500x750?text=Three',
			altText: 'Placeholder Image Three',
			buttonText: 'Button Label 3',
			linkUrl: '#3',
		},
		{
			imageUrl: 'https://placehold.co/1500x750?text=Four',
			altText: 'Placeholder Image Four',
			buttonText: 'Button Label 4',
			linkUrl: '#4',
		},
		{
			imageUrl: 'https://placehold.co/1500x750?text=Five',
			altText: 'Placeholder Image Five',
			buttonText: 'Button Label 5',
			linkUrl: '#5',
		},
		{
			imageUrl: 'https://placehold.co/1500x750?text=Six',
			altText: 'Placeholder Image Six',
			buttonText: 'Button Label 6',
			linkUrl: '#6',
		},
	];

	return (
		<>
			<Track
				ariaLabel='Featured Content'
				trackId='track-example-1'
				utilities='track--column-2--lg track--peeking--lg'
				panels={panels}
				floatDirectionalButtons={true}
			/>
		</>
	);
};

export default TrackExamples;
