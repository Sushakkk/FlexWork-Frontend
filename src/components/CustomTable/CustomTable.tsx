import React from 'react';
import { useTable } from 'react-table';
import { Table } from 'reactstrap';
import { useSelector } from 'react-redux';  // Подключаем useSelector для доступа к состоянию
import './CustomTable.css';

function CustomTable({ columns, data, onClick }) {
    const {
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data
    });

    const isStaff = useSelector((state) => state.user.is_staff);  // Достаем роль пользователя

    const onTdClicked = (row, e) => {
        if (e.target.tagName !== "BUTTON") {
            onClick(row.values.id);
        }
    };

    const isUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    return (
        <div>
            <div>
                {headerGroups.map(headerGroup => (
                    <div className={`table__header ${isStaff ? 'moderator' : 'user'}`} {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()} key={column.getHeaderProps().key}>{column.render('Header')}</th>
                        ))}
                    </div>
                ))}
            </div>

            <div className="table__cards">
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <div 
                            className="table__row"  
                            {...row.getRowProps()} 
                            key={row.getRowProps().key} 
                            onClick={(e) => onTdClicked(row, e)} 
                            style={{ cursor: "pointer" }}
                        >
                            <div className={`table__card ${isStaff ? 'moderator' : 'user'}`}>
                                {row.cells.map(cell => {
                                    return (
                                        <div {...cell.getCellProps()} key={cell.getCellProps().key}>
                                            {cell.column.id === 'id' ? i + 1 :
                                                cell.column.id === 'img_url' && isUrl(cell.value) ? 
                                                <img src={cell.value} alt="Activity" style={{ maxWidth: '100px', maxHeight: '100px' }} /> :
                                                cell.render('Cell')
                                            }
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CustomTable;
