import { FC } from 'react';
import { Container, Typography } from '@mui/material';

import { WIP } from 'components/wip/WIP';

export const StatsPage: FC = () => (
    <Container sx={{ pt: 10 }}>
        <Typography variant="h2">Statistics</Typography>
        <br />
        <br />
        <br />
        <WIP />
    </Container>
);
