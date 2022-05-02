import { Link } from 'react-router-dom';

function Product(props) {
  const { product } = props;
  return (
    <div key={product._id} className="card">
      <Link to={`/product/${product._id}`}>
        <img className="medium" src={product.imageurl} alt="img-producto" />
      </Link>

      <div className="card-info">
        <Link to={`/product/${product._id}`}>
          <h3 className="nombre-prod">{product.nombre}</h3>
        </Link>
        <div>${product.preciousd?.toFixed(2)}</div>
      </div>
    </div>
  );
}

export default Product;
