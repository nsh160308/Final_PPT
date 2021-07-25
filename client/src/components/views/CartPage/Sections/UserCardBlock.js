import React, { useEffect } from 'react'
import { Button } from 'antd';
import "./UserCardBlock.css"
function UserCardBlock(props) {
    console.log(props.products);
    const renderCartImage = (images) => {
        if (images.length > 0) {
            let image = images[0]
            return `http://localhost:5000/${image}`
        }
    }

    const renderItems = () => (
        props.products && props.products.map((product, index) => (
            <tr className='tr-body' key={index}>
                <td>
                    {++index}
                </td>
                <td>
                    <div style={{display:'flex'}}>
                        <img style={{ width: '70px' }} alt="product"
                            src={renderCartImage(product.images)} />
                        <p>{product.title}</p>
                    </div>
                </td>
                <td>
                    {product.size}
                </td>
                <td>
                    {product.quantity}
                </td>
                <td>
                    $ {product.price}
                </td>
                <td>
                    {/* 사이즈랑 품번 넘김 */}
                    <Button type="danger" onClick={() => props.removeItem(product.size, product._id)}>
                        삭제
                    </Button>
                </td>
            </tr>
        ))
    )
    return (
        <div>
            <table>
                <thead>
                    <tr className="tr-header">
                        <th>(번호)</th>
                        <th>(이미지)</th>
                        <th>(사이즈)</th>
                        <th>(개수)</th>
                        <th>(가격)</th>
                        <th>(기타)</th>
                    </tr>
                </thead>

                <tbody>
                    {renderItems()}
                </tbody>
            </table>
        </div>
    )
}

export default UserCardBlock
