import { useEffect, useState } from "react";
import { Col, Container, Form, Input, Row, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { T_SelfEmployedFilters } from "../../utils/types";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";
import SelfEmployedTable from "../../components/SelfEmployedTable/SelfEmployedTable";
import { fetchAllSelfEmployed, updateFilters } from "../../slices/selfEmployedSlice";

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

  

  
  const [status, setStatus] = useState(filters.status ==='draft'? "" :filters.status );
  const [dateFormationStart, setDateFormationStart] = useState(filters.start_date || "");
  const [dateFormationEnd, setDateFormationEnd] = useState(filters.end_date || "");
  const [username, setUsername] = useState(filters.username || "");

  const statusOptions = {
    "": "Любой",
    formed: "Сформирована",
    completed: "Завершена",
    rejected: "Отклонена",
  };

  // Эффект для проверки аутентификации
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/403/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (filters) {
      setStatus(filters.status || "");
      setDateFormationStart(filters.start_date || "");
      setDateFormationEnd(filters.end_date || "");
      setUsername(filters.username || "");
    }
  }, [filters]);

  // Эффект для обновления фильтров в Redux и запроса данных
  useEffect(() => {
    const updateSelfEmployedData = () => {
      const updatedFilters: T_SelfEmployedFilters = {
        status: status || "",
        start_date: dateFormationStart || "",
        end_date: dateFormationEnd || "",
        username: username || "",
      };

      // Обновляем фильтры в Redux
      dispatch(updateFilters(updatedFilters)); 
      // Запрашиваем данные с учётом новых фильтров
      dispatch(fetchAllSelfEmployed());
    };

    updateSelfEmployedData(); // Инициализация запроса с актуальными фильтрами

    const intervalId = setInterval(updateSelfEmployedData, 5000); // Повторный запрос каждые 3 секунды

    return () => clearInterval(intervalId); // Очистка интервала при размонтировании компонента
  }, [status, dateFormationStart, dateFormationEnd, username, dispatch]);

  // Фильтрация самозанятых по имени пользователя с проверкой на undefined и null
  const filteredSelfEmployed = all_self_employed.filter((item) => {
    if (username && typeof username === 'string' && item.user_username) {
      return item.user_username.toLowerCase().includes(username.toLowerCase());
    }
    return true;
  });

  // Обработчик сброса фильтров
  const handleResetFilters = () => {
    setStatus("");
    setDateFormationStart("");
    setDateFormationEnd("");
    setUsername("");

    // Сброс фильтров в Redux
    dispatch(updateFilters({
      status: "",
      start_date: "",
      end_date: "",
      username: "",
    }));
  };

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
                  onChange={(e) => setDateFormationStart(e.target.value)} 
                />
              </Col>
              <Col md="2" className="d-flex flex-row gap-3 align-items-center">
                <label>До</label>
                <Input
                  type="date"
                  value={dateFormationEnd}
                  onChange={(e) => setDateFormationEnd(e.target.value)} 
                />
              </Col>
              <Col md="3">
                <CustomDropdown
                  label="Статус"
                  selectedItem={status}
                  setSelectedItem={setStatus} 
                  options={statusOptions}
                />
              </Col>
              <Col md="3">
                <Input
                  type="text"
                  placeholder="Имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} 
                />
              </Col>
              {/* Добавляем кнопку сброса фильтров */}
              <Col md="2">
                <Button className="button-page grey" onClick={handleResetFilters}>
                  Сбросить фильтры
                </Button>
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
