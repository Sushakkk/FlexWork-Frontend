import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  deleteActivityFromSelfEmployed,
  deleteSelfEmployed,
  fetchSelfEmployed,
  formSelfEmployed,
  updateByModeratorHandler,
  updateImportance,
  updateSelfEmployed
} from '../../slices/selfEmployedSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row, Input } from 'reactstrap';
import './DetailsSelfEmployedPage.css';




const  statuses: Record<string, string> = {
  draft: "Черновик",
  deleted: "Удалена",
  formed: "Сформирована",
  completed: "Завершена",
  rejected: "Отклонена",
};

const DetailsSelfEmployedPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const self_employed = useAppSelector((state) => state.selfEmployed.detail_self_employed);
  const isStaff = useAppSelector((state) => state.user.is_staff);

  const [fio, setFio] = useState('');
  const [isDeleted, setIsDeleted] = useState(false);
  const [isForm, setIsForm] = useState(false);
  const [isdeleteM, setDeleteM] = useState(false);

  const status = self_employed?.self_employed?.status;
  

  useEffect(() => {
    dispatch(fetchSelfEmployed(String(id)));
  }, [dispatch, id, isDeleted, isForm, isdeleteM]);

  useEffect(() => {
    if (self_employed?.self_employed?.fio) {
      setFio(self_employed.self_employed.fio);
    }
  }, [self_employed]);

  const saveFields = async (e) => {
    e.preventDefault();

    const data = {
      fio: fio,
    };

    await dispatch(updateSelfEmployed({ id: id, fio: data.fio }));
  };

  const deleteSelfEmployedHandler = async () => {
    if (id) {
      await dispatch(deleteSelfEmployed(id));
      setIsDeleted(true);
      navigate('/activities');
    } else {
      console.error('ID не найден для удаления');
    }
  };

  const formSelfEmployedHandler = async () => {
    if (id) {
      await dispatch(formSelfEmployed(id));
      setIsForm(true);
      navigate('/activities');
    } else {
      console.error('ID не найден для удаления');
    }
  };

  const ModeratorHandler = async (status: string) => {
    if (id) {
      await dispatch(updateByModeratorHandler({ id: id, status: status }));
      setIsForm(true);
      navigate('/self-employed');
    } else {
      console.error('ID не найден');
    }
  };

  const deleteActivityFromSelfEmployedHandler = async (activity_id) => {
    if (id) {
      console.log('Deleting activity with ID:', activity_id);

      // Удаление активности
      await dispatch(deleteActivityFromSelfEmployed({ self_employed_id: id, activity_id }));

      // Обновление состояния (например, isdeleteM) после выполнения действия
      setDeleteM(true);  // Это состояние может быть в useState

      // Обновление данных
      await dispatch(fetchSelfEmployed(String(id)));
    }
  };

  const handleCheckboxChange = async (activityId, importance) => {
    await dispatch(updateImportance({
      self_employed_id: id,
      activity_id: activityId,
      importance: importance
    }));

    await dispatch(fetchSelfEmployed(String(id)));
  };

  if (!self_employed || id === 'null') {
    return (
      <div className='home'>
        Корзина пуста
      </div>
    );
  }

  const { activities } = self_employed;




  return (
    <main id="main" className="page">
      <div className="page__basket _container">
        <div className="basket__content">
          <div className='basket__titles'>
          <div className="basket_fio_container">
            <span className="basket_fio detail-label">Самозанятый:</span>
            <Input
              type="text"
              value={fio}
              onChange={(e) => setFio(e.target.value)}
              placeholder="Введите ФИО"
            />
            <button onClick={saveFields} className="button-page grey" type="submit">Сохранить</button>
          </div>
          {status!=='draft' &&(
            <div><span className="basket_fio detail-label">Статус:</span>{statuses[status]}</div>
          )}
          </div>
          
          <div className="basket__cards">
            {activities.map((activity) => (
              <div className="basket__row" key={activity.id}>
                <div className="basket__card item-basket">
                  <div className="item-basket__img">
                    <img src={activity.img_url} alt={activity.title} />
                  </div>
                  <h3 className="item-basket__title">{activity.title}</h3>

                  {activity.importance ? (
                    <img
                      className="basket__img"
                      src={`http://${window.location.hostname}:9000/flexwork/main_service.svg`}
                      alt="basket"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      className='checkbox'
                      checked={activity.importance} // если важность активности true, чекбокс будет отмечен
                      onChange={() => handleCheckboxChange(activity.id, !activity.importance)} // инвертируем значение importance
                      id={`checkbox-${activity.id}`}
                      disabled={status !== 'draft'} 
                    />
                  )}

                  <div className="item-basket__price-button">
                    <Link to={`/activity/${activity.id}`} className="item-basket__button button-page">
                      Подробнее
                    </Link>
                  </div>
                </div>
                {status==='draft' &&(
                  <svg
                  onClick={() => deleteActivityFromSelfEmployedHandler(activity.id)}
                  width="64px"
                  height="64px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#adadad"
                  style={{ cursor: 'pointer' }}
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M6 6L18 18" stroke="#adadad" strokeLinecap="round"></path>
                    <path d="M18 6L6.00001 18" stroke="#adadad" strokeLinecap="round"></path>
                  </g>
                </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {status === 'draft' && activities.length !== 0 && (
          <Row className="mt-5">
            <Col className="d-flex gap-5 justify-content-center">
              <button className="button-page grey" onClick={formSelfEmployedHandler}>Сформировать</button>
              <button className="button-page grey" onClick={deleteSelfEmployedHandler}>Удалить</button>
            </Col>
          </Row>
        )}
        {isStaff && status !== 'completed' && status !== 'rejected' && (
          <Row className="mt-5">
            <Col className="d-flex gap-5 justify-content-center">
              <button className="button-page grey" onClick={() => ModeratorHandler('completed')}>Завершить</button>
              <button className="button-page grey" onClick={() => ModeratorHandler('rejected')}>Отклонить</button>
            </Col>
          </Row>
        )}
      </div>
    </main>
  );
};

export default DetailsSelfEmployedPage;
