import React from 'react';
import esLocale from '@fullcalendar/core/locales/es';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick

function Calendario() {
	const handleDateClick = (arg) => {
		// bind with an arrow function
		alert(arg.dateStr);
	};
	return (
		<section>
			<FullCalendar
				locale={esLocale}
				plugins={[dayGridPlugin, interactionPlugin]}
				initialView='dayGridMonth'
				events={[
					{ title: 'evento 1', date: '2022-05-01' },
					{ title: 'evento 2', date: '2022-05-01' },

					{ title: 'event 2', date: '2022-05-02' },
				]}
				dateClick={handleDateClick}
			/>
		</section>
	);
}

export default Calendario;
