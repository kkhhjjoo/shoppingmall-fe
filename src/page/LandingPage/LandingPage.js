import React, { useEffect, useState } from 'react';
import ProductCard from './components/ProductCard';
import { Row, Col, Container } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductList } from '../../features/product/productSlice';
import ReactPaginate from 'react-paginate';

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productList = useSelector((state) => state.product.productList);
  const [query] = useSearchParams();
  const name = query.get('name');
  const [searchQuery, setSearchQuery] = useState({
    page: query.get('page') || 1,
    name: query.get('name') || '',
  }); //검색 조건들을 저장하는 객체
  const totalPageNum = useSelector((state) => state.product.totalPageNum);
  // URL에 검색어가 있는 상태로 진입했을 때(직접 링크, 새로고침) searchQuery 동기화
  useEffect(() => {
    const page = query.get('page') || 1;
    const name = query.get('name') || '';
    setSearchQuery((prev) => {
      const nextPage = Number(page) || 1;
      const nextName = name || '';
      if (prev.page === nextPage && prev.name === nextName) return prev;
      return { page: nextPage, name: nextName };
    });
  }, [query.get('page'), query.get('name')]);
  useEffect(() => {
    dispatch(getProductList({ ...searchQuery }));
  }, [searchQuery, dispatch]);
  const handlePageClick = ({ selected }) => {
    //  쿼리에 페이지값 바꿔주기
    console.log('selected', selected);
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };
  useEffect(() => {
    //검색어나 페이지가 바뀌면 url바꿔주기 (단, 이미 URL과 같으면 덮어쓰지 않음 → 직접 링크/새로고침 시 검색어 유지)
    const urlPage = query.get('page') || '1';
    const urlName = query.get('name') || '';
    const samePage = String(searchQuery.page) === String(urlPage);
    const sameName = String(searchQuery.name || '') === String(urlName);
    if (samePage && sameName) return;
    const params = new URLSearchParams();
    params.set('page', String(searchQuery.page));
    if (searchQuery.name) params.set('name', searchQuery.name);
    navigate('?' + params.toString());
  }, [searchQuery]);

  return (
    <Container>
      <Row>
        {productList.length > 0 ? (
          productList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {!name ? (
              <h2>등록된 상품이 없습니다!</h2>
            ) : (
              <h2>{name}과 일치한 상품이 없습니다!</h2>
            )}
          </div>
        )}
      </Row>
      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPageNum}
        forcePage={searchQuery.page - 1}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        className="display-center list-style-none"
      />
    </Container>
  );
};

export default LandingPage;
