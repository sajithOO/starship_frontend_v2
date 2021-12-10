import { Grid, Box, Table, TableCell, TableContainer, TableHead, TableRow, Zoom } from "@material-ui/core";
import "./choosebond.scss";

function ChooseBond() {
    return (
        <div className="choose-bond-view">
            <Zoom in={true}>
                <div className="choose-bond-view-card">
                    <div className="choose-bond-view-card-header">
                        <p className="choose-bond-view-card-title">StarBond (🌌, 🌌)</p>
                    </div>

                    <Grid container item xs={12} spacing={2} className="choose-bond-view-card-metrics">
                        <Grid item xs={12} sm={12}>
                            <Box textAlign="center">
                                <p className="choose-bond-view-card-metrics-title">STARSHIP Price</p>
                                <p className="choose-bond-view-card-metrics-value">$10</p>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid container item>
                        <TableContainer className="choose-bond-view-card-table">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            <p className="choose-bond-view-card-table-title">STARBOND COMING SOON!</p>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                        </TableContainer>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default ChooseBond;
