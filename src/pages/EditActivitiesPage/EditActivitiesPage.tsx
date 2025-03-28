import { useEffect, useState } from "react";
import { Col, Container, Form, Input, Row } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { T_SelfEmployedFilters } from "../../utils/types";

import { fetchAllSelfEmployed, updateFilters } from "../../slices/selfEmployedSlice";
import ActivitiesTable from "../../components/ActivitiesTable";
import { clearActivity, fetchActivities, setNewActivity } from "../../slices/activitiesSlice";



const EditActivitiesPage = () => {
  const dispatch = useAppDispatch();

  const activities = useAppSelector((state) => state.activities.activities);
  const isAuthenticated = useAppSelector((state) => state.user?.is_authenticated);
  const isStaff = useAppSelector((state) => state.user.is_staff);



  const navigate = useNavigate();



  const handleAddClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(setNewActivity(true))


      navigate('/edit-activity/null');
  };

  const statusOptions = {
    "": "Любой", 
    active: "Активна",
    deleted: "Удалена",
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/403/");
    }
  }, [isAuthenticated, navigate]);


useEffect(()=>{
  if (!isStaff) {
    navigate('/404')
  }
  dispatch(fetchActivities())
  dispatch(clearActivity())
},[])





  return (
    <main id="main" className="page">
      <div className="page__services _container">
        <Container>
          

          {activities.length ? (
            <ActivitiesTable activities={activities} />
          ) : (
            <h3 className="text-center mt-5">Самозанятые не найдены</h3>
          )}

<Row className="mt-5">
            <Col className="d-flex gap-5 justify-content-center">
              <button  className="button-page grey" onClick={handleAddClick}>Добавить</button>
            </Col>
          </Row>
        </Container>
      </div>
    </main>
  );
};

export default EditActivitiesPage;