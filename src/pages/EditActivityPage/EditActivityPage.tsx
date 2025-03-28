import React, { useEffect, useState, useRef } from 'react';
import './EditActivityPage.css';
import '../ActivitiesPage/ActivitiesPage.css'
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { useAppDispatch, useAppSelector } from '../../store';
import { AddActivity, EditActivity, clearNewActivity, deleteActivity, fetchActivity, useActivity } from '../../slices/activitiesSlice';
import { Col, Row } from 'reactstrap';

const EditActivityPage: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const dispatch = useAppDispatch();
  const isStaff = useAppSelector((state) => state.user.is_staff);
  const activity = useActivity();
  const [editableTitle, setEditableTitle] = useState(activity?.title || '');
  const [editableDescription, setEditableDescription] = useState(activity?.description || '');
  const [editableCategory, setEditableCategory] = useState(activity?.category || '');
  const [editableImage, setEditableImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(activity?.img_url || '');

  const new_activity= useAppSelector((state) => state.activities.new_activity);

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
      // Redirect or show success message
      navigate('/edit-activities/');
    });
  };
  




  useEffect(() => {

      dispatch(fetchActivity(String(id)));
   
  }, [id,  dispatch]);
  useEffect(() => {

     console.log('activity', activity)
     if (activity) {
        setEditableTitle(activity.title || '');
        setEditableDescription(activity.description || '');
        setEditableCategory(activity.category || '');
        setImagePreview(activity.img_url || '');
       
      }
   
  }, [activity]);


  useEffect(() => {
    if (!isStaff) {
      navigate('/404')
    }
  }, []);

  if (!activity) {
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
                <div className="main-block__image">
                    <img
                      src={'https://avatars.mds.yandex.net/i?id=284efc4987205a8f579db78365821d19_sr-8271622-images-thumbs&n=13'}
                      alt={'default'}
                      
                    />
                  </div>
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
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </main>
    );
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
              />
            </h1>
            <div className="main-block__image" onClick={handleImageClick} style={{ cursor: 'pointer' }}>
              <img
                src={imagePreview}
                alt={activity.title}
                onError={(e) => { e.currentTarget.src = 'https://avatars.mds.yandex.net/i?id=284efc4987205a8f579db78365821d19_sr-8271622-images-thumbs&n=13'; }}
              />
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
                />
              </div>
              <div className="main-block__container-details">
                <p><span className="detail-label">Категория:</span></p>
                <textarea
           
                  value={editableCategory}
                  onChange={(e) => setEditableCategory(e.target.value)}
                />
              </div>
            </div>
            <Row className="mt-5">
            <Col className="d-flex gap-5 justify-content-center">
              <button  className="button-page grey" onClick={handleSaveClick}>Сохранить</button>
              <button  className="button-page grey" onClick={handleDeleteActivity}>Удалить</button>
            </Col>
          </Row>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditActivityPage;