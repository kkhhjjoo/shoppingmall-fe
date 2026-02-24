import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import OrderReceipt from './component/OrderReceipt';
import PaymentForm from './component/PaymentForm';
import './style/paymentPage.style.css';
import { cc_expires_format } from '../../utils/number';
import { createOrder } from '../../features/order/orderSlice';
import { getCartList } from '../../features/cart/cartSlice';

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { orderNum } = useSelector((state) => state.order);
  const [cardValue, setCardValue] = useState({
    cvc: '',
    expiry: '',
    focus: '',
    name: '',
    number: '',
  });
  const navigate = useNavigate();
  const [shipInfo, setShipInfo] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    address: '',
    city: '',
    zip: '',
  });
  console.log('shipinfo', shipInfo);
  const { cartList, totalPrice } = useSelector((state) => state.cart);

  // useEffect(() => {
  //   console.log('111');
  //   dispatch(getCartList()).then((result) => {
  //     const data = result.payload?.data;
  //     if (!data || data.length === 0) {
  //       navigate('/cart');
  //     }
  //   });
  // }, [dispatch, navigate]);

  useEffect(() => {
    if (orderNum) {
      navigate('/payment/success');
    }
  }, [orderNum, navigate]);

  useEffect(() => {
    if (cartList?.length === 0) {
      navigate('/cart');
    }
  }, [cartList, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // 오더 생성하기
    const { firstName, lastName, contact, address, city, zip } = shipInfo;
    dispatch(
      createOrder({
        totalPrice,
        shipTo: { address, city, zip },
        contact: { firstName, lastName, contact },
        orderList: cartList.map((item) => ({
          productId: item.productId._id,
          price: item.productId.price,
          qty: item.qty,
          size: item.size,
        })),
      })
    );
  };

  const handleFormChange = (event) => {
    //shipInfo에 값 넣어주기
    const { name, value } = event.target;
    setShipInfo({ ...shipInfo, [name]: value });
  };

  const handlePaymentInfoChange = (event) => {
    //카드정보 넣어주기
    const { name, value } = event.target;
    if (name === 'expiry') {
      let newValue = cc_expires_format(value);
      setCardValue({ ...cardValue, [name]: newValue });
      return;
    }
    setCardValue({ ...cardValue, [name]: value });
  };

  const handleInputFocus = (e) => {
    setCardValue({ ...cardValue, focus: e.target.name });
  };

  return (
    <Container>
      <Row>
        <Col lg={7}>
          <div>
            <h2 className="mb-2">배송 주소</h2>
            <div>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="lastName">
                    <Form.Label>성</Form.Label>
                    <Form.Control type="text" onChange={handleFormChange} required name="lastName" />
                  </Form.Group>

                  <Form.Group as={Col} controlId="firstName">
                    <Form.Label>이름</Form.Label>
                    <Form.Control type="text" onChange={handleFormChange} required name="firstName" />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>연락처</Form.Label>
                  <Form.Control placeholder="010-xxx-xxxxx" onChange={handleFormChange} required name="contact" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridAddress2">
                  <Form.Label>주소</Form.Label>
                  <Form.Control placeholder="Apartment, studio, or floor" onChange={handleFormChange} required name="address" />
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control onChange={handleFormChange} required name="city" />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control onChange={handleFormChange} required name="zip" />
                  </Form.Group>
                </Row>
                <div className="mobile-receipt-area">
                  <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
                </div>
                <div>
                  <h2 className="payment-title">결제 정보</h2>
                  <PaymentForm cardValue={cardValue} handleInputFocus={handleInputFocus} handlePaymentInfoChange={handlePaymentInfoChange} />
                </div>

                <Button variant="dark" className="payment-button pay-button" type="submit">
                  결제하기
                </Button>
              </Form>
            </div>
          </div>
        </Col>
        <Col lg={5} className="receipt-area">
          <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
