
import {AppBar, Toolbar } from '@material-ui/core';
import ToggleButton from '@mui/material/ToggleButton';


export default function PaginationUsers(props) {
    const getPages = () => {
        const result = [];
        for (let i = 0; i < props.total; i++) {
            let page = i + 1;
            result.push(
                <a onClick={()=>props.onChange(page)}>{(page)}</a>
                )
        }
        console.log(result);
        return result;
    }

    return (
        <AppBar position='static'>
        <Toolbar>
            Page {props.page} of {props.total}
               <br/> 
               {getPages().map(number =>(
                <ToggleButton color="primary" value={number}>{number}</ToggleButton>   
               ))}
        </Toolbar>
      </AppBar>
    );

}