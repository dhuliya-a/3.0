import './landing.css';
import UserLogin from './user-login/userLogin';
import CollectionDetails from './collection-details/collectionDetails';

function Landing() {
  return (
    <div className="landing">
        <UserLogin></UserLogin>
        <CollectionDetails></CollectionDetails>
    </div>
  );
}

export default Landing;
