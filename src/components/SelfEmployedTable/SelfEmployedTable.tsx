import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store";  // Подключаем dispatch
import CustomTable from "../CustomTable";
import { formatDate } from "../../utils/utils";
import { T_SelfEmployed } from "../../utils/types";
import { updateByModeratorHandler } from "../../slices/selfEmployedSlice";

interface SelfEmployedTableProps {
  all_self_employed: T_SelfEmployed[];
}

const SelfEmployedTable: React.FC<SelfEmployedTableProps> = ({ all_self_employed }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();  // Используем dispatch из Redux
  const isStaff = useAppSelector((state) => state.user.is_staff);

  const handleClick = (self_employed_id: number): void => {
    navigate(`/self-employed/${self_employed_id}`);
  };

  const statuses: Record<string, string> = {
    draft: "Черновик",
    deleted: "Удалена",
    formed: "Сформирована",
    completed: "Завершена",
    rejected: "Отклонена",
  };

  const ModeratorHandler = async (status: string, id: number) => {
    if (id) {
      dispatch(updateByModeratorHandler({ id: id, status: status }));
      navigate('/self-employed');
    } else {
      console.error('ID не найден');
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "№",
        accessor: "id",
      },
      {
        Header: "Пользователь",
        accessor: "user_username",
        Cell: ({ value }: { value: string }) => statuses[value] || value,
      },
      {
        Header: "Статус",
        accessor: "status",
        Cell: ({ value }: { value: string }) => statuses[value] || value,
      },
      {
        Header: "Дата создания",
        accessor: "created_date",
        Cell: ({ value }: { value: string }) => formatDate(value),
      },
      {
        Header: "Дата завершения",
        accessor: "completion_date",
        Cell: ({ value }: { value: string }) => value ? formatDate(value) : "--",
      },
      {
        Header: "ИНН",
        accessor: "inn",
        Cell: ({ value }: { value: string }) => value || "",
      },
      ...(isStaff ? [  // Условно добавляем столбцы только для модераторов
        {
          Header: "Завершить",
          id: "actions-completed",
          Cell: ({ row }: { row: any }) => {
            const { id, status } = row.original;
          
            return (
              <button 
                onClick={() => ModeratorHandler('completed', id)} 
                className="button-page-s green"
                disabled={status === "completed" || status === "rejected"}
              >
                Завершить
              </button>
            );
          },
        },
        {
          Header: "Отклонить",
          id: "actions-rejected",
          Cell: ({ row }: { row: any }) => {
            const { id, status } = row.original;
         
            return (
              <button 
                onClick={() => ModeratorHandler('rejected', id)} 
                className="button-page-s red"
                disabled={status === "rejected" || status === "completed"}
              >
                Отклонить
              </button>
            );
          },
        }
      ] : []) // Если не модератор, столбцы не добавляются
    ],
    [dispatch, isStaff]  // Добавляем isStaff в зависимости
  );
  

  return <CustomTable columns={columns} data={all_self_employed} onClick={handleClick}  />;
};

export default SelfEmployedTable;
