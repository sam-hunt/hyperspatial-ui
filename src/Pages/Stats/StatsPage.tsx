import { Container, Typography } from '@mui/material';
import WIP from '../../components/WIP/WIP';

const StatsPage = () => {

    return (
        <Container sx={{ pt: 10 }}>
            <Typography variant='h2'>Statistics</Typography>
            <br /><br /><br />
            <WIP />
        </Container>
    );
}

export default StatsPage;