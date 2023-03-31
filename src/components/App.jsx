import { fetchData } from '../api/api';
import { ToastContainer } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import 'react-toastify/dist/ReactToastify.css';
import Container from './Container/Container';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import { useState, useEffect, useRef } from 'react';

export const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [itemsAmount, setItemsAmount] = useState(12);

  const imgItemRef = useRef(null);

  useEffect(() => {
    if (query !== '') {
      setPage(1);
      setIsLoading(true);
      setError(null);
      (async () => {
        try {
          const fetchedItems = await fetchData(query, page);
          if (fetchedItems.hits.length === 0) {
            throw new Error('Nothing found! Check that the input is correct');
          }
          setTotalPages(Math.ceil(fetchedItems.totalHits / 12));
          setItems(fetchedItems.hits);
          setIsLoading(false);
        } catch (error) {
          setError(error.message);
          setIsLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (page !== 1) {
      setIsLoading(true);
      const fetchingNextPage = async () => {
        const items = await fetchData(query, page);
        setItems(prev => [...prev, ...items.hits]);
        setIsLoading(false);
        setItemsAmount(items.hits.length);
      };
      fetchingNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (items !== 0) {
      imgItemRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [items]);

  const onChangePage = () => {
    setPage(prev => prev + 1);
  };

  const onHandleSubmit = value => {
    setQuery(value);
    setPage(1);
  };

  const openModal = data => {
    setModalData(data);
  };

  const closeModal = () => {
    setModalData(null);
  };

  return (
    <Container>
      <Searchbar onSubmit={onHandleSubmit} />
      {error === null ? (
        <ImageGallery
          items={items}
          openModal={openModal}
          imgItemRef={imgItemRef}
          itemsAmount={itemsAmount}
        />
      ) : (
        <p
          style={{
            fontSize: '24px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {error}
        </p>
      )}
      {items.length > 0 &&
        !isLoading &&
        error === null &&
        page !== totalPages && <Button onChangePage={onChangePage} />}
      {isLoading && (
        <div style={{ margin: '0 auto' }}>
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </div>
      )}
      {modalData && <Modal {...modalData} closeModal={closeModal} />}
      <ToastContainer autoClose={3000} />
    </Container>
  );
};
