import React, { memo, useEffect, useMemo, useState } from 'react';
import * as _ from 'lodash';
import { PlayerData } from '../../common/types';
import './PlayerList.css';

type PlayerListProps = {
    players: PlayerData[],
    onPlayerSelected: (plyaer: PlayerData) => void,
    backgroundColor: string
}

const calculateLumens = (backgroundColor: string) => {
    const c = backgroundColor.substring(1),
        rgb = parseInt(c, 16),
        r = (rgb >> 16) & 0xff,
        g = (rgb >> 8) & 0xff,
        b = (rgb >> 0) & 0xff;

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, onPlayerSelected, backgroundColor }) => {

    const lumanes = useMemo(() => calculateLumens(backgroundColor), [backgroundColor]);

    return (
        <ul className='list'>
            {
                _.map(players, (player, index) => {
                    return <li key={index} className='list-item' style={{ backgroundColor: backgroundColor, color: lumanes > 50 ? 'black' : 'white' }}>
                        <Player player={player} onSelect={(player) => onPlayerSelected(player)} />
                    </li>
                })
            }
        </ul>
    )
}

export const Player: React.FC<{ player: PlayerData, onSelect: (player: PlayerData) => void }> = ({ player, onSelect }) => {
    return (
        <div className='player-grid'>
            <Column title={'Full Name'} content={`${player.first_name} ${player.last_name}`} />
            <Column title={'Team'} content={`${player.team.name}`} />
            <Column title={'Position'} content={`${player.position}`} />
            <Column title={'Height (Inches)'} content={`${player.height_inches}`} />
            <Column title={'Height (Feet)'} content={`${player.height_feet}`} />
            <Column title={'Weight (Pounds)'} content={`${player.weight_pounds}`} />
            {<button className='select-button' onClick={() => onSelect(player)}></button>}
        </div>
    )
}

const Column: React.FC<{ title: string, content: any }> = ({ title, content }) => {
    return (
        <div className='grid-column'>
            <span style={{ gridRow: 1 }}>{title}</span>
            <span style={{ gridRow: 2, padding: 10 }}>{content && content !== 'null' ? content : '( - )'}</span>
        </div>
    )
}

export default memo(PlayerList);