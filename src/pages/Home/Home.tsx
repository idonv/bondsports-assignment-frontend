import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PlayerList from '../../components/PlayerList/PlayerList';
import Spinner from '../../components/Spinner/Spinner';
import Search from '../../components/Search/Search';
import { PlayerData, PlayersAPIReponse } from '../../common/types';
import _ from 'lodash';
import './Home.css'

const fetchPlayers = (searchText: string, page: number = 1): Promise<PlayersAPIReponse> => {
    let url = `https://www.balldontlie.io/api/v1/players?page=${page}&per_page=50`;
    if (searchText) {
        url += `&search=${searchText}`;
    }

    return fetch(url).then(res => res.json())
}


const HomePage: React.FC<{}> = (props) => {

    const [favoritePlayers, setFavoritePlayers] = useState<PlayerData[]>([]);
    const [players, setPlayers] = useState<PlayerData[]>([]);

    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [hasNextPage, setHasNextPage] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const [backgroundColor, setBackgroundColor] = useState('#dcdcde');

    useEffect(() => {
        if (currentPage > 1) {
            setCurrentPage(1);
        }

        const fn = async () => {

            setIsLoading(true);

            const data: PlayersAPIReponse = await fetchPlayers(searchText);

            setPlayers(data.data);
            setHasNextPage(!data.meta?.total_pages || data.meta?.total_pages > data.meta.current_page);
            setIsLoading(false);
        }

        fn();

    }, [searchText]);

    const fetchNextPlayers = async (page: number) => {
        if (page > 1) {
            setIsLoading(true);

            const data: PlayersAPIReponse = await fetchPlayers(searchText, page);

            setPlayers(prev => [...prev, ...data.data]);
            setHasNextPage(!data.meta?.total_pages || data.meta?.total_pages > page);
            setCurrentPage(data.meta?.current_page);
            setIsLoading(false);
        }
    };

    const addPlayerToFavoritesList = useCallback((player: PlayerData) => {
        const isPlayerAlreadySelected = _.find(favoritePlayers, p => p.id === player.id);
        if (!isPlayerAlreadySelected) {
            setFavoritePlayers(previouslySelected => [...previouslySelected, player])
        }
    }, [favoritePlayers]);

    const removePlayerFromFavoritesList = useCallback((player: PlayerData) => {
        const filteredFavoritesList = _.filter(favoritePlayers, p => p.id !== player.id);
        setFavoritePlayers(filteredFavoritesList);
    }, [favoritePlayers]);

    return (
        <div className='home-container'>
            <Search disabled={false} onSearch={setSearchText} />
            <div className='lists-container'>
                <div className='list-container'>
                    {
                        isLoading && <Spinner />
                    }
                    <PlayerList backgroundColor={backgroundColor} players={players} onPlayerSelected={addPlayerToFavoritesList} />
                    <button className='loading-button' disabled={!hasNextPage} onClick={() => fetchNextPlayers(currentPage + 1)}>Load more players</button>
                </div>
                <div className='list-container'>
                    <PlayerList backgroundColor={backgroundColor} players={favoritePlayers} onPlayerSelected={removePlayerFromFavoritesList} />
                </div>
            </div>
            <div className='color-picker-wrapper'>
                <input className='color-picker' type='color' defaultValue={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
            </div>
        </div>
    )
}


export default HomePage;


