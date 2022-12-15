import { ChangeEvent, memo, useCallback } from "react";
import * as _ from 'lodash';
import './Search.css';

const Search: React.FC<{ disabled: boolean, onSearch: (search: string) => void }> = ({ disabled, onSearch }) => {

    const onChangeHandler = _.debounce((e: ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value);
    }, 500);

    return (
        <div style={{ justifySelf: 'center', width: '47%', paddingBottom: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <input className='searchbar' placeholder='Search name...' style={{ fontSize: 25 }} disabled={disabled} onChange={onChangeHandler} />
        </div>
    )
}

export default memo(Search);