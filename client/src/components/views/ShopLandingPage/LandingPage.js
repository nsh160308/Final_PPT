import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Col, Card, Row, Button } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
// import Checkbox from './Sections/CheckBox';
// import Radiobox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';
import { continents, price } from './Sections/Datas';
import SubMenuPage from './Sections/SubMenuPage';

const MetaDesign = {
    fontFamily:"Georgia",
    fontWeight:"bold",
}

function LandingPage() {

    //state관리
    const [Products, setProducts] = useState([]);
    const [Skip, setSkip] = useState(0);
    const [Limit, setLimit] = useState(8);
    const [PostSize, setPostSize] = useState(0);
    const [Filters, setFilters] = useState({
        continents: [],
        price: [],
        clothes: []
    });
    const [SearchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let body = {
            skip: Skip,
            limit: Limit
        }
        getProducts(body)
    }, [])

    
    const getProducts = (body) => {
        axios.post('/api/product/products', body)
            .then(response => {
                console.log('Shop랜딩 결과', response.data);
                if (response.data.success) {
                    if (body.loadMore) {
                        setProducts([...Products, ...response.data.productInfo])
                    } else {
                        setProducts(response.data.productInfo)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert(" 상품들을 가져오는데 실패 했습니다.")
                }
            })
    }

    const loadMoreHanlder = () => {

        let skip = Skip + Limit
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true,
            filters: Filters
        }
        getProducts(body)
        setSkip(skip)
    }

    const renderCards = Products.map((product, index) => {
        return <Col lg={6} md={8} xs={24} key={index}>
            <Card
                cover={<a href={`/product/${product._id}`} ><ImageSlider images={product.images} /></a>}
            >
                <Meta
                    style={{...MetaDesign}}
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })

    const showFilteredResults = (filters) => {
        console.log('showFiltered', filters);
        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }
        getProducts(body);//상품을 가져오고
        setSkip(0)//스킵 초기화
    }

    const handlePrice = (value) => {
        console.log('value', value);
        const data = price;
        let array = [];

        for (let key in data) {
            if (data[key]._id === parseInt(value, 10)) {
                array = data[key].array;
            }
        }
        return array;
    }

    const handleFilters = (filters, category) => {
        console.log("자식이 건네준 정보", filters, category);
        const newFilters = { ...Filters }
        console.log('기존에 있던 필터링 정보', newFilters);
        newFilters[category] = filters;
        console.log('새롭게 만들어낸 필터링 결과 ', newFilters[category]);
        if (category === "price") {
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }//미구현
        showFilteredResults(newFilters)//함수 호출
        setFilters(newFilters)
    }

    const updateSearchTerm = (newSearchTerm) => {
        let body = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }
        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)
    }

    return (
        <div style={{ width: '85%', margin: '1rem auto'}}>
            <Row gutter={[16, 16]}>
                {/* Filter */}
                <Col lg={4}>
                    <div>
                        {/* 메인 페이지 옆 상품분류 */}
                        <SubMenuPage handleFilters={handleFilters}/>
                    </div>
                </Col>
                {/* 상품 목록들과 검색창 */}
                <Col lg={20}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>
                            {/* 상품 검색 창 */}
                            <SearchFeature
                                refreshFunction={updateSearchTerm}
                            />
                        </div>
                        <br/>
                        {/* 상품 */}
                        <Row gutter={[16, 16]} >
                            {renderCards}
                        </Row>
                        <br />
                        {/* 더보기 버튼 */}
                        {PostSize >= Limit &&
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button onClick={loadMoreHanlder}>Load More</Button>
                            </div>
                        }
                    </div>
                </Col>
            </Row>
        </div>
    )
}
export default LandingPage
