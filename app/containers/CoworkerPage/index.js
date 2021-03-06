/*
 *
 * CoworkerPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import blue from 'material-ui/colors/blue';
import Dialog, {
  DialogActions,
  DialogTitle,
} from 'material-ui/Dialog';

import { makeSelectFilteredCoworkers, makeSelectNameFilter, makeSelectShowEmptyEmailOnly, makeSelectShowDeleteConfirmDialog, makeSelectCoworkerToDelete } from './selectors';
import { loadCoworkers, changeFilterText, toggleEmptyEmailOnly, deleteCoworker, showDeleteDialog } from './actions';
// import messages from './messages';

const styles = () => ({
  container: {
    minWidth: '600px',
    margin: '0 auto',
  },
  toolbarContainer: {
    margin: '0 24px 16px 24px',
    display: 'flex',
    'justify-content': 'flex-start',
    'align-items': 'flex-end',
  },
  newButton: {
    marginBottom: '8px',
    marginRight: '8px',
  },
  filterInput: {
    flex: '1 0 auto',
  },
  swtich: {
    marginTop: 16,
    marginLeft: 8,
    marginRight: 0,
  },
  tableHeader: {
    backgroundColor: blue[300],
    color: 'white',
  },
  nameColumn: {
    width: '20%',
  },
  actionColumn: {
    width: '10%',
    'white-space': 'nowrap',
  },
});

export class CoworkerPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.onLoadCoworkers();
  }

  render() {
    const { classes, showEmptyEmailOnly, nameFilter, showDeleteConfirmDialog, coworkerToDelete,
      onChangeNameFilter, onToggleShowEmptyEmailOnly, onDeleteCoworker, onDeleteConfirmDialogClose } = this.props;
    return (
      <Paper className={classes.container}>
        <div className={classes.toolbarContainer}>
          <Button className={classes.newButton} color="primary" raised component={Link} to="/createcoworker">New</Button>
          <TextField
            className={classes.filterInput}
            id="name-filter"
            type="text"
            margin="normal"
            label="Name Filter"
            value={nameFilter}
            onChange={onChangeNameFilter}
            placeholder="Add Name Filter"
            autoFocus
          />
          <div className={classes.swtich}>
            <FormControlLabel
              control={
                <Switch
                  checked={showEmptyEmailOnly}
                  onChange={onToggleShowEmptyEmailOnly}
                />
              }
              label="Show Empty Email"
            />
          </div>
        </div>
        <Table>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.nameColumn}>
                <Typography type="title" color="inherit">
                  Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography type="title" color="inherit">
                  Email
                </Typography>
              </TableCell>
              <TableCell className={classes.actionColumn} />
            </TableRow>
          </TableHead>
          <TableBody>
            {
              this.props.coworkers.map((coworker, index) =>
                (
                  <TableRow key={`resource-${index}`}>
                    <TableCell key={`name-${index}`}>
                      {coworker.name}
                    </TableCell>
                    <TableCell key={`contact-${index}`}>
                      {coworker.contacts.length > 0 ? coworker.contacts[0].value : ''}
                    </TableCell>
                    <TableCell key={`operation-${index}`} className={classes.actionColumn}>
                      <IconButton component={Link} to={`/updatecoworker/${coworker._id}`}>
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="Delete" onClick={() => onDeleteCoworker(coworker)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )
            }
          </TableBody>
        </Table>
        <Dialog open={showDeleteConfirmDialog} onRequestClose={() => onDeleteConfirmDialogClose(false)}>
          <DialogTitle>{`Do you want to delete "${coworkerToDelete && coworkerToDelete.name}"?`}</DialogTitle>
          <DialogActions>
            <Button onClick={() => onDeleteConfirmDialogClose(false)} color="primary">
              No
            </Button>
            <Button onClick={() => onDeleteConfirmDialogClose(true, coworkerToDelete && coworkerToDelete._id)} raised color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

CoworkerPage.propTypes = {
  coworkers: PropTypes.array.isRequired,
  onLoadCoworkers: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  showEmptyEmailOnly: PropTypes.bool.isRequired,
  nameFilter: PropTypes.string.isRequired,
  onChangeNameFilter: PropTypes.func.isRequired,
  onToggleShowEmptyEmailOnly: PropTypes.func.isRequired,
  onDeleteCoworker: PropTypes.func.isRequired,
  showDeleteConfirmDialog: PropTypes.bool.isRequired,
  onDeleteConfirmDialogClose: PropTypes.func.isRequired,
  coworkerToDelete: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  coworkers: makeSelectFilteredCoworkers(),
  nameFilter: makeSelectNameFilter(),
  showEmptyEmailOnly: makeSelectShowEmptyEmailOnly(),
  showDeleteConfirmDialog: makeSelectShowDeleteConfirmDialog(),
  coworkerToDelete: makeSelectCoworkerToDelete(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadCoworkers: () => dispatch(loadCoworkers()),
    onChangeNameFilter: (event) => dispatch(changeFilterText(event.target.value)),
    onToggleShowEmptyEmailOnly: (event, checked) => dispatch(toggleEmptyEmailOnly(checked)),
    onDeleteCoworker: (coworkerToDelete) => dispatch(showDeleteDialog(true, coworkerToDelete)),
    onDeleteConfirmDialogClose: (deleteConfirmed, coworkerId) => {
      dispatch(showDeleteDialog(false));
      if (deleteConfirmed) {
        dispatch(deleteCoworker(coworkerId));
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CoworkerPage));
