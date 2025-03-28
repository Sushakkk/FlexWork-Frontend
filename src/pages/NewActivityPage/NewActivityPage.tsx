import React, { useEffect, useState, useRef } from 'react';
import './EditActivityPage.css';
import '../ActivitiesPage/ActivitiesPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { useAppDispatch, useAppSelector } from '../../store';
import { AddActivity, EditActivity, clearNewActivity, deleteActivity, fetchActivity } from '../../slices/activitiesSlice';
import { Col, Row } from 'reactstrap';

const NewActivityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const isStaff = useAppSelector((state) => state.user.is_staff);
  const activity = useAppSelector((state) => state.activities.activity);
  const new_activity = useAppSelector((state) => state.activities.new_activity);
  
  const [editableTitle, setEditableTitle] = useState('');
  const [editableDescription, setEditableDescription] = useState('');
  const [editableCategory, setEditableCategory] = useState('');
  const [editableImage, setEditableImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const navigate = useNavigate();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditableImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleImageClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const handleSaveClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const data = {
      title: editableTitle,
      description: editableDescription,
      category: editableCategory,
      pic: editableImage,
    };

    if (new_activity) {
      // Add new activity
      dispatch(AddActivity({ id: String(id), data })).then(() => {
        dispatch(clearNewActivity())

        navigate('/edit-activities/');
      });
    } else {
      // Edit existing activity
      dispatch(EditActivity({ id: String(id), data })).then(() => {
        navigate('/edit-activities/');
      });
    }
  };

  const handleDeleteActivity = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(deleteActivity(String(id))).then(() => {
      navigate('/edit-activities/');
    });
  };

  useEffect(() => {
    if (!new_activity && id) {
      dispatch(fetchActivity(String(id)));
    }
  }, [id, new_activity, dispatch]);

  useEffect(() => {
    if (activity) {
      setEditableTitle(activity.title || '');
      setEditableDescription(activity.description || '');
      setEditableCategory(activity.category || '');
      setImagePreview(activity.img_url || '');
    }
  }, [activity]);

  useEffect(() => {
    if (!isStaff) {
      navigate('/404');
    }
  }, [isStaff, navigate]);

  if (!isStaff) {
    return <div>Access Denied</div>;
  }

  return (
    <main id="main" className="page">
      <Breadcrumbs />
      <div className="page__main-block _container">
        <div className="main-content">
          <div className="main-block__body">
            <h1 className="main-block__title title_main">
              <textarea
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                placeholder="Введите название"
              />
            </h1>

            {/* Display the image or allow to upload a new one */}
            <div className="main-block__image" onClick={handleImageClick} style={{ cursor: 'pointer' }}>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={editableTitle || "Activity Image"}
                  onError={(e) => { e.currentTarget.src = 'https://avatars.mds.yandex.net/i?id=284efc4987205a8f579db78365821d19_sr-8271622-images-thumbs&n=13'; }}
                />
              ) : (
                <div>Загрузить изображения</div> // Placeholder when no image is selected
              )}
            </div>

            <input
              type="file"
              ref={inputFileRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />

            <div className="main-block__details">
              <div className="main-block__container-details">
                <div><span className="detail-label">Описание:</span></div>
                <textarea
                  className="full-width"
                  value={editableDescription}
                  onChange={(e) => setEditableDescription(e.target.value)}
                  placeholder="Введите описание"
                />
              </div>
              <div className="main-block__container-details">
                <p><span className="detail-label">Категория:</span></p>
                <textarea
                  value={editableCategory}
                  onChange={(e) => setEditableCategory(e.target.value)}
                  placeholder="Введите категорию"
                />
              </div>
            </div>

            <Row className="mt-5">
              <Col className="d-flex gap-5 justify-content-center">
                <button className="button-page grey" onClick={handleSaveClick}>
                  {new_activity ? 'Добавить' : 'Сохранить'}
                </button>
                {!new_activity && (
                  <button className="button-page grey" onClick={handleDeleteActivity}>
                    Удалить
                  </button>
                )}
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NewActivityPage;