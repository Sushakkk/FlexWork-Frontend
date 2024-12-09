import { useEffect, useState } from "react"; 
import { Col, Container, Form, Input, Row } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { T_SelfEmployedFilters } from "../../utils/types";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";
import SelfEmployedTable from "../../components/SelfEmployedTable/SelfEmployedTable";
import { fetchAllSelfEmployed, updateFilters } from "../../slices/selfEmployedSlice";

// Объект с возможными статусами
const statuses: Record<string, string> = {
  draft: "Черновик",
  deleted: "Удалена",
  formed: "Сформирована",
  completed: "Завершена",
  rejected: "Отклонена",
};

const SelfEmployedPage = () => {
  const dispatch = useAppDispatch();

  const all_self_employed = useAppSelector((state) => state.selfEmployed.self_employed);
  const isAuthenticated = useAppSelector((state) => state.user?.is_authenticated);
  const filters = useAppSelector<T_SelfEmployedFilters>((state) => state.selfEmployed.filters);

  const navigate = useNavigate();

  const [status, setStatus] = useState(""); // По умолчанию пустой статус
  const [dateFormationStart, setDateFormationStart] = useState(""); 
  const [dateFormationEnd, setDateFormationEnd] = useState(""); 
  const [username, setUsername] = useState(""); // Новое состояние для имени пользователя

  const statusOptions = {
    "": "Любой", 
    formed: "Сформирована",
    completed: "Завершена",
    rejected: "Отклонена",
  };

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/403/");
//     }
//   }, [isAuthenticated, navigate]);

  // Эффект для загрузки данных самозанятых при изменении фильтров
  useEffect(() => {
    // Обновляем фильтры в хранилище
    const updatedFilters: T_SelfEmployedFilters = {
      status: status || "", 
      start_date: dateFormationStart || "", 
      end_date: dateFormationEnd || "", 
    };
    
    dispatch(updateFilters(updatedFilters)); // Обновляем фильтры в состоянии
    dispatch(fetchAllSelfEmployed()); // Загружаем данные с примененными фильтрами
  }, [status, dateFormationStart, dateFormationEnd, dispatch]);

  // Фильтрация самозанятых по имени пользователя
  const filteredSelfEmployed = all_self_employed.filter((item) =>
    item.user_username.toLowerCase().includes(username.toLowerCase())
  );

  return (
    <main id="main" className="page">
      <div className="page__services _container">
        <Container>
          <Form>
            <Row className="mb-4 d-flex align-items-center">
              <Col md="2" className="d-flex flex-row gap-3 align-items-center">
                <label>От</label>
                <Input
                  type="date"
                  value={dateFormationStart}
                  onChange={(e) => setDateFormationStart(e.target.value)} // Обновляем дату начала
                />
              </Col>
              <Col md="2" className="d-flex flex-row gap-3 align-items-center">
                <label>До</label>
                <Input
                  type="date"
                  value={dateFormationEnd}
                  onChange={(e) => setDateFormationEnd(e.target.value)} // Обновляем дату окончания
                />
              </Col>
              <Col md="3">
                <CustomDropdown
                  label="Статус"
                  selectedItem={status}
                  setSelectedItem={setStatus} // Обновляем статус
                  options={statusOptions}
                />
              </Col>
              <Col md="3">
                <Input
                  type="text"
                  placeholder="Имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} // Обновляем имя пользователя
                />
              </Col>
            </Row>
          </Form>

          {filteredSelfEmployed.length ? (
            <SelfEmployedTable all_self_employed={filteredSelfEmployed} />
          ) : (
            <h3 className="text-center mt-5">Самозанятые не найдены</h3>
          )}
        </Container>
      </div>
    </main>
  );
};

export default SelfEmployedPage;
