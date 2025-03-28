import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import CustomTable from "../CustomTable";
import { T_Activity } from "../../utils/types";
import TableActivities from "../TableActivities/TableActivities";


interface ActivitiesTableProps {
  activities: T_Activity[];
}

const ActivitiesTable: React.FC<ActivitiesTableProps> = ({ activities }) => {
  const navigate = useNavigate();

  const handleClick = (activity_id: number): void => {
    navigate(`/edit-activity/${activity_id}`);
  };

  const statuses: Record<string, string> = {
    active: "Активна",
    deleted: "Удалена",
  };

  const columns = useMemo(
    () => [
      {
        Header: "№",
        accessor: "id", // используем id как уникальный идентификатор
      },
      {
        Header: "Заголовок",
        accessor: "title", 
        Cell: ({ value }: { value: string }) => value ? value : "--", 
      },
      {
        Header: "Описание",
        accessor: "description", 
        Cell: ({ value }: { value: string }) => value ? value : "--",
      },
      {
        Header: "Изображение",
        accessor: "img_url", 
        Cell: ({ value }: { value: string }) => value ? value : "--",
      },
      {
        Header: "Категория",
        accessor: "category",
        Cell: ({ value }: { value: string }) => value ? value : "--",
      },
      // {
      //   Header: "Статус",
      //   accessor: "status", 
      //   Cell: ({ value }: { value: string }) => statuses[value] || value,
      // }
    ],
    []
  );

  return <TableActivities columns={columns} data={activities} onClick={handleClick} />;
};

export default ActivitiesTable;
