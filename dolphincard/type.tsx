import {
  Box,
  ClickAwayListener,
  Grid,
  ListItemText,
  MenuItem,
  MenuList,
} from '@mui/material';
import openIcon from '../../../assets/icons/openIcon.svg';
import {useState} from "react";
import PopupState, { bindTrigger } from "material-ui-popup-state";
import { setSelectedType } from "../../../utils/helpers";
import styles from './typeWrapper.module.css'

interface StatusAndTypeProps {
  onSelectedTypesChange?: (selectedStatus: string) => void;
}
function TypeWrapper({ onSelectedTypesChange }: StatusAndTypeProps ) {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  // const [selectedTypes, setSelectedTypes] = useState<string>('Type');
  const typesList = ['Incoming', 'Outgoing']

  const handleClickAway = () => {
    setShowOptions(false);
  };

  const handleOptionClick = (selectedTypes: any | null) => {
    setShowOptions(false);
    // setSelectedTypes(newSelectedTypes);
    onSelectedTypesChange?.(selectedTypes);
    // setSearchValue('');
  };

  return (
    <ClickAwayListener
      onClickAway={handleClickAway}
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
    >
      <Grid container direction="column" style={{position: 'relative', width: '150px'}}>
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => {
            return (
              <Grid>
                <Grid
                  container
                  className={`${styles.statusSelectorWrapper}`}
                  {...bindTrigger(popupState)}
                >
                  <Grid item className={styles.statusSearchContainer}>
                    <Grid
                      className={styles.statusSearchContainer}
                      onClick={() => setShowOptions(!showOptions)}
                    >
                      Type
                    </Grid>
                  </Grid>
                  <Grid item sm={1.5}>
                    <Grid container spacing={1.75}>
                      <Grid
                        item
                        className={styles.iconOptions}
                      >
                        <img
                          src={openIcon}
                          alt="open Icon"
                          onClick={() => setShowOptions(!showOptions)}
                          className={styles.openIcon}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                {
                  showOptions  && (
                    <MenuList
                      className={`${styles.statusOptionsContainer}`}
                      id="scrollableDiv"
                    >
                      {typesList.map((value: any, index: number) => (
                        <MenuItem
                          key={index}
                          className={styles.menuItem}
                          onClick={() => handleOptionClick(setSelectedType(value))}
                        >
                          <ListItemText style={{ color: value && value.color ? value.color : 'black' }}>
                            <Grid container justifyContent="space-between">
                              <Box className={styles.listItemText}>
                                                                <span className={styles.profileStatusName}>
                                                                   {/*{getSelectedType(value.type)}*/}
                                                                  {value}
                                                                </span>
                              </Box>
                            </Grid>
                          </ListItemText>
                        </MenuItem>
                      ))}
                    </MenuList>
                  )
                }
              </Grid>
            )
          }}
        </PopupState>
      </Grid>
    </ClickAwayListener>
  );
}

export default TypeWrapper;