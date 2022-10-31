import { useEffect, useState } from 'react';

const bool_calc_dir_diff_rad = true; // $E$16
//const const_inclination = 30; // °, Dachneigung $B$9
//const roofDirect = 90; // °, Himmelsrichtung $B$10
//const const_latitude = 48.569; // $B$5
//const const_longitude = 12.559; // $B$4
//const nom_power = 10; // kWp $B$11
const const_solar_constant = 1356.5; //$B$13
const const_derating_factor = 0.85; //$B$27
const const_temperature_coefficient = -0.37; //$B$28
const const_albedo = 0.2; //$B$30
const const_delta_t_installation = 28.0; //$B$31
var globRadArr = [];

const SolarCalculation = ({
  roofSlope,
  roofDirect,
  lat,
  lng,
  pwr,
  setGlobalRadiation,
  setPVYield,
  arrYear,
}) => {
  const [GHIData, setGHIData] = useState();
  const [DHIData, setDHIData] = useState();
  const [BHIData, setBHIData] = useState();
  const [AmbTempData, setAmbTempData] = useState();
  //const [globalRadiation, setGlobalRadiation] = useState([]);
  //const [pvYield, setPVYield] = useState([]);
  //var start = new Date('2020-12-31 23:00:00');
  var start = new Date('2018-12-31 23:00');
  var refDay = new Date('2019-01-01 00:00:00');
  const debug = 1;

  useEffect(() => {
    console.log('useEffect');

    // Fetch Amb Temp data
    fetch('./AmbTemp.json')
      .then((response) => response.json())
      .then((json) => {
        setAmbTempData(json);
        console.log('useEffect/AmbTemp');
      });

    // Fetch GHI data
    fetch('./GHI.json')
      .then((response) => response.json())
      .then((json) => {
        setGHIData(json);
        console.log('useEffect/GHIData');
      });

    // Fetch DHI data
    fetch('./DHI.json')
      .then((response) => response.json())
      .then((json) => {
        setDHIData(json);
        console.log('useEffect/DHIData');
      });

    // Fetch BHI data
    fetch('./BHI.json')
      .then((response) => response.json())
      .then((json) => {
        setBHIData(json);
        console.log('useEffect/BHI: ', json);
      })
      .then(() => {
        console.log('useEffect/main: ', roofSlope, roofDirect, lat, lng, pwr);
        main();
      });
  });

  const main = () => {
    console.log('main/1: ', GHIData, DHIData, BHIData, AmbTempData, arrYear);
    var arrResult = [];
    for (let date = 0; date < arrYear.length; date++) {
      console.log('main/2: ');
      //arrYear.length
      let i = date;
      let datum = new Date(arrYear[date]);
      if (debug > 0) console.log('main: ', day_of_year(datum, refDay), datum, i);
      arrResult.push(pv_yield(datum, day_of_year(datum, refDay), i));
    }
    setGlobalRadiation(globRadArr);
    setPVYield(arrResult);
    console.log('SC/Result: ', arrResult);
  };

  // Yield Wh
  const pv_yield = (datum, day, no) => {
    var res =
      const_derating_factor *
      pwr *
      r_tilted_total(datum, day, no) *
      (1 + (const_temperature_coefficient / 100) * (t_modul(datum, day, no) - 25));

    //setPVYield([...pvYield, res]);
    if (debug > 1) console.log('r_tilted_total: ', res);
    return res;
  };

  const t_modul = (datum, day, no) => {
    var res =
      temperature(datum, day, no) + const_delta_t_installation * (r_tilted_total(datum, day, no) / 1000);
    if (debug > 1) console.log('t_modul: ', res);
    return res;
  };

  // Global radiation in module plane Wh/m²
  const r_tilted_total = (datum, day, no) => {
    var res = r_tilted_ref(datum, day, no) + r_tilted_dif(datum, day, no) + r_tilted_dir(datum, day, no);
    globRadArr.push(res);
    if (debug > 1) console.log('r_tilted_total: ', res);
    return res;
  };

  const r_tilted_ref = (datum, day, no) => {
    var res = r_hor_total(datum, day, no) * const_albedo * 0.5 * (1 - Math.cos(bogenmass(roofSlope)));
    if (debug > 2) console.log('r_tilted_ref: ', res);
    return res;
  };

  const r_tilted_dif = (datum, day, no) => {
    var res = r_hor_dif(datum, day, no) * 0.5 * (1 + Math.cos(bogenmass(roofSlope)));
    if (debug > 2) console.log('r_tilted_dif: ', res);
    return res;
  };

  const r_tilted_dir = (datum, day, no) => {
    let res = BNI(datum, day, no) * Math.cos(angle_of_incidence(datum, day));
    if (debug > 2) console.log('r_tilted_dir: ', res);

    return res > 0 ? res : 0;
  };

  const temperature = (datum, day, no) => {
    var res;
    if (bool_calc_dir_diff_rad) {
      res = AmbTempData?.[no];
    } else {
      res = AmbTempData?.[no];
    }
    if (debug > 1) console.log('temperature: ', res);
    return res;
  };
  const r_hor_total = (datum, day, no) => {
    var res = BNI(datum, day, no) + r_hor_dif(datum, day, no);
    if (debug > 1) console.log('r_hor_total: ', res);
    return res;
  };

  const r_hor_dif = (datum, day, no) => {
    var res;
    if (bool_calc_dir_diff_rad) {
      res = DHI(datum, day, no);
    } else {
      res = DHIData[no];
    }
    if (debug > 1) console.log('r_hor_dif: ', res);
    return res;
  };

  const sun_azimuth_rad = (datum, day) => {
    var res;
    if (TLT_hour(datum, day) <= 12) {
      res =
        Math.PI -
        Math.acos(
          (Math.sin(sun_elevation_angle_rad(datum, day)) * Math.sin(bogenmass(lat)) -
            Math.sin(declination(datum, day))) /
            (Math.cos(sun_elevation_angle_rad(datum, day)) * Math.cos(bogenmass(lat)))
        );
    } else {
      res =
        Math.PI +
        Math.acos(
          (Math.sin(sun_elevation_angle_rad(datum, day)) * Math.sin(bogenmass(lat)) -
            Math.sin(declination(datum, day))) /
            (Math.cos(sun_elevation_angle_rad(datum, day)) * Math.cos(bogenmass(lat)))
        );
    }
    if (debug > 1) console.log('sun_azimuth_rad: ', res);
    return res;
  };

  const TLT_hour = (datum, day) => {
    var res = datum.getHours() + 1;
    res === 23 ? (res = 0) : (res = res);
    if (debug > 2) console.log('TLT_hour: ', res);
    return res;
  };

  const declination = (datum, day) => {
    var res = bogenmass(
      0.3948 -
        23.2559 * Math.cos(bogenmass(j_strich(datum, day) + 9.1)) -
        0.3915 * Math.cos(bogenmass(2 * j_strich(datum, day) + 5.4)) -
        0.1764 * Math.cos(bogenmass(3 * j_strich(datum, day) + 26))
    );
    if (debug > 2) console.log('declination: ', res);
    return res;
  };

  const j_strich = (datum, day) => {
    var res = (360 * day) / 365;
    if (debug > 2) console.log("j': ", res, day);
    return res;
  };

  const sun_elevation_angle_grad = (datum, day) => {
    var res = grad(sun_elevation_angle_rad(datum, day));
    if (debug > 2) console.log('sun_elevation_angle_grad: ', res);
    return res;
  };

  const sun_elevation_angle_rad = (datum, day, no) => {
    var res = Math.asin(
      Math.cos(hour_angle_rad(datum, day)) *
        Math.cos(declination(datum, day)) *
        Math.cos(bogenmass(lat)) +
        Math.sin(bogenmass(lat)) * Math.sin(declination(datum, day))
    );
    if (debug > 2) console.log('sun_elevation_angle_rad: ', res);
    return res;
  };

  const hour_angle_rad = (datum, day) => {
    var res = bogenmass(15 * (12 - TLT_min(datum, day) / 60));
    if (debug > 2) console.log('hour_angle_rad: ', res);
    return res;
  };

  const TLT_min = (datum, day) => {
    if (TLT_adj(datum, day) > 0) {
      return TLT_adj(datum, day);
    } else {
      return 24 * 60 + TLT_adj(datum, day);
    }
  };

  const TLT_adj = (datum, day) => {
    var res = MLT_adj(datum, day) + TEQ_min(datum, day);
    if (debug > 2) console.log('TLT_adj: ', res);
    return res;
  };

  const TEQ_min = (datum, day) => {
    var res =
      0.0066 +
      7.3525 * Math.cos(bogenmass(j_strich(datum, day) + 85.9)) +
      9.9359 * Math.cos(bogenmass(2 * j_strich(datum, day) + 108.9)) +
      0.3387 * Math.cos(bogenmass(3 * j_strich(datum, day) + 105.2));
    if (debug > 2) console.log('TEQ_min: ', res);
    return res;
  };

  const MLT_adj = (datum, day) => {
    var res = time_min(datum, day) + 4 * lng;
    if (debug > 2) console.log('MLT_adj: ', res);
    return res;
  };

  const time_min = (datum, day) => {
    //if (debug > 2) console.log('time_min/in: ', datum);
    var res = datum.getHours() * 60 + 30;
    if (debug > 2) console.log('time_min: ', res);
    return res;
  };

  const angle_of_incidence = (datum, day) => {
    var res = Math.acos(
      -Math.cos(sun_elevation_angle_rad(datum, day)) *
        Math.sin(bogenmass(roofSlope)) *
        Math.cos(sun_azimuth_rad(datum, day) - (bogenmass(roofDirect) - Math.PI)) +
        Math.sin(sun_elevation_angle_rad(datum, day)) * Math.cos(bogenmass(roofSlope))
    );
    if (debug > 2) console.log('angle_of_incidence: ', res);
    return res;
  };

  const BNI = (datum, day, no) => {
    var res;

    if (sun_elevation_angle_grad(datum, day) > 1) {
      if (bool_calc_dir_diff_rad && sun_elevation_angle_rad(datum, day) > 0) {
        res = BHI(datum, day, no) / Math.sin(sun_elevation_angle_rad(datum, day));
      } else {
        if (!bool_calc_dir_diff_rad && sun_elevation_angle_rad(datum) > 0) {
          res = beam_horiz_irrad(datum, day, no) / Math.sin(sun_elevation_angle_rad(datum, day));
        } else {
          res = 0;
        }
      }
    } else {
      res = beam_horiz_irrad(datum, day, no);
    }

    if (debug > 1) console.log('BNI: ', res);

    return res;
  };

  const beam_horiz_irrad = (datum, day, no) => {
    var res = BHIData[no];
    if (debug > 1) console.log('beam_horizontal_irradiation: ', res);
    return res;
  };

  const BHI = (datum, day, no) => {
    var res;
    if (GHI(datum, day, no) - DHI(datum, day, no) < 0) {
      res = 0;
    } else {
      res = GHI(datum, day, no) - DHI(datum, day, no);
    }
    if (debug > 1) console.log('BHI: ', res);
    return res;
  };

  const GHI = (datum, day, no) => {
    var res = GHIData?.[no];
    if (debug > 2) console.log('GHI: ', res, no);
    return res;
  };

  const DHI = (datum, day, no) => {
    var res;
    if (k_T(datum, day, no) < 0.3 && k_T(datum, day, no) >= 0) {
      res = GHI(datum, day, no) * (1.02 - 0.249 * k_T(datum, day, no));
    } else {
      if (k_T(datum, day, no) > 0.3 && k_T(datum, day, no) < 0.78) {
        res = GHI(datum, day, no) * (1.45 - 1.67 * k_T(datum, day, no));
      } else {
        res = GHI(datum, day, no) * 0.147;
      }
    }
    if (debug > 2) console.log('DHI: ', res, no);
    return res;
  };

  const k_T = (datum, day, no) => {
    var res;
    if (GHI(datum, day, no) > 0 && I_ex(datum, day, no) > 0) {
      res = GHI(datum, day, no) / I_ex(datum, day, no);
    } else {
      res = 0;
    }
    if (debug > 2) console.log('k_T: ', res);
    return res;
  };

  const I_ex = (datum, day, no) => {
    var res =
      adjusted_solar_constant(datum, day, no) * Math.sin(sun_elevation_angle_rad(datum, day, no));
    if (debug > 2) console.log('I_ex: ', res);
    return res;
  };

  const adjusted_solar_constant = (datum, day, no) => {
    var res = const_solar_constant + 48.5 * Math.cos(0.01721 * (day - 15));
    if (debug > 2) console.log('adjusted_solar_constant: ', res, day);
    return res;
  };

  const day_of_year = (date1, date2) => {
    const diffInMill = date1 - date2;
    const diffInDays = diffInMill / 1000 / 60 / 60 / 24;
    if (debug > 3) console.log('day_of_year: ', diffInDays, Math.floor(diffInDays) + 1, date1);
    return Math.floor(diffInDays) + 1;
  };

  const bogenmass = (grad) => {
    return (grad * Math.PI) / 180;
  };

  const grad = (radian) => {
    return (radian * 180) / Math.PI;
  };

  //console.log('before render: ', main());
};

export default SolarCalculation;
