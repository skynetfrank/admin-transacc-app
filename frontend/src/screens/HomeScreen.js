import payimg from '../payimg.png';
import pagosimg from '../pagosimg.jpg';
import calendarimg from '../calendar.jpg';

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCalendarAlt,
	faMoneyCheck,
	faPencilAlt,
	faPlusSquare,
	faTableList,
	faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../components/Tooltip';

function HomeScreen() {
	return (
		<div>
			<>
				<div className='row center gapper'>
					<div className='card'>
						<Link to={`/`}>
							<img className='medium' src={pagosimg} alt='egresos' />
						</Link>
						<div className='card-info'>
							<Link to={`/createregistro`}>
								<FontAwesomeIcon icon={faPlusSquare} />
							</Link>
							<Link to={`/registrolist`}>
								<FontAwesomeIcon icon={faTableList} />
							</Link>
							<Tooltip position='bottom' content='Calendario'>
								<Link to={'/'}>
									<FontAwesomeIcon icon={faCalendarAlt} />
								</Link>
							</Tooltip>
						</div>
					</div>
					<div className='card'>
						<Link to={`/`}>
							<img className='medium' src={calendarimg} alt='calendario' />
						</Link>
						<div className='card-info'>
							<Link to={`/`}>
								<FontAwesomeIcon icon={faMoneyCheck} />
							</Link>
							<Link to={`/`}>
								<FontAwesomeIcon icon={faMoneyCheck} />
							</Link>
							<Tooltip position='bottom' content='Calendario'>
								<Link to={`/`}>
									<FontAwesomeIcon icon={faCalendarAlt} />
								</Link>
							</Tooltip>
						</div>
					</div>
				</div>
			</>
		</div>
	);
}

export default HomeScreen;
