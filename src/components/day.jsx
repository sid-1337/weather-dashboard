import React from 'react';
import './day.css'
export default function DailyForcast(props) {

    function getday(UNIX_timestamp) {
        let a = new Date(UNIX_timestamp * 1000)
        let b = a.toDateString().substring(4, 7) + " " + a.getDate();
        return b;
    }
    // console.log(getday(1720852200))

    const res = props.content.list;
    return res.map((el) => {
        return (
            <>

                <div className="grid-item">
                    {/* {e} : {el.value[index]} */}
                    {el.temp.day.toFixed(0) - 273}&deg;C
                    <img src={`https://openweathermap.org/img/wn/${el.weather[0].icon}@2x.png`} />
                    {getday(el.dt)}

                </div>

            </>
        );
    });
}