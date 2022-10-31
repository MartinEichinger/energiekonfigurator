const bool_calc_dir_diff_rad = true; // $E$16
const const_solar_constant = 1356.5; //$B$13
const const_derating_factor = 0.85; //$B$27
const const_temperature_coefficient = -0.37; //$B$28
const const_albedo = 0.2; //$B$30
const const_delta_t_installation = 28.0; //$B$31

class SolarCalculation {
  constructor(roofSlope, roofDirect, lat, lng, pwr, setGlobalRadiation, setPVYield, arrYear) {
    this.start = new Date('2018-12-31 23:00');
    this.refDay = new Date('2019-01-01 00:00:00');
    this.debug = 0;
    this.roofSlope = roofSlope;
    this.roofDirect = 90; //roofDirect;
    this.lat = lat;
    this.lng = lng;
    this.pwr = 10; //pwr;
    this.arrYear = arrYear;
    this.arrPVYield = [];
    this.arrGlobRad = [];

    // Fetch Amb Temp data
    fetch('./AmbTemp.json')
      .then((response) => response.json())
      .then((json) => {
        this.AmbTempData = json;
        console.log('construct/AmbTemp');
      });

    // Fetch GHI data
    fetch('./GHI.json')
      .then((response) => response.json())
      .then((json) => {
        this.GHIData = json;
        console.log('useEffect/GHIData');
      });

    // Fetch DHI data
    fetch('./DHI.json')
      .then((response) => response.json())
      .then((json) => {
        this.DHIData = json;
        console.log('useEffect/DHIData');
      });

    // Fetch BHI data
    fetch('./BHI.json')
      .then((response) => response.json())
      .then((json) => {
        this.BHIData = json;
        console.log('useEffect/BHI: ', json);
      });
  }

  main() {
    this.arrGlobRad = [];
    console.log(
      'main/1: ',
      this.GHIData,
      this.DHIData,
      this.BHIData,
      this.AmbTempData,
      this.arrYear,
      this.arrGlobRad
    );

    for (let date = 0; date < this.arrYear.length; date++) {
      console.log('SolarCalculation/ongoing');
      //arrYear.length
      let i = date;
      let datum = new Date(this.arrYear[date]);
      if (this.debug > 0) console.log('main: ', this.day_of_year(datum, this.refDay), datum, i);
      this.arrPVYield.push(this.pv_yield(datum, this.day_of_year(datum, this.refDay), i));
    }
    //setGlobalRadiation(globRadArr);
    //setPVYield(arrResult);
    console.log('SolarCalculation/PVYield: ', this.arrPVYield);
  }

  // Yield Wh
  pv_yield(datum, day, no) {
    var r_tilted_total_inner = this.r_tilted_total(datum, day, no);
    this.arrGlobRad.push(r_tilted_total_inner);
    var res =
      const_derating_factor *
      this.pwr *
      r_tilted_total_inner *
      (1 + (const_temperature_coefficient / 100) * (this.t_modul(datum, day, no) - 25));

    //setPVYield([...pvYield, res]);
    if (this.debug > 1) console.log('pv_yield: ', res);
    return res;
  }

  t_modul(datum, day, no) {
    var res =
      this.temperature(datum, day, no) +
      const_delta_t_installation * (this.r_tilted_total(datum, day, no) / 1000);
    if (this.debug > 1) console.log('t_modul: ', res);
    return res;
  }

  // Global radiation in module plane Wh/m²
  r_tilted_total(datum, day, no) {
    var res1 = this.r_tilted_ref(datum, day, no);
    var res2 = this.r_tilted_dif(datum, day, no);
    var res3 = this.r_tilted_dir(datum, day, no);
    if (this.debug > 1) console.log('r_tilted_total: ', res1, res2, res3);
    return res1 + res2 + res3;
  }

  r_tilted_ref(datum, day, no) {
    var res =
      this.r_hor_total(datum, day, no) *
      const_albedo *
      0.5 *
      (1 - Math.cos(this.bogenmass(this.roofSlope)));
    if (this.debug > 2) console.log('r_tilted_ref: ', res);
    return res;
  }

  r_tilted_dif(datum, day, no) {
    var res = this.r_hor_dif(datum, day, no) * 0.5 * (1 + Math.cos(this.bogenmass(this.roofSlope)));
    if (this.debug > 2) console.log('r_tilted_dif: ', res);
    return res;
  }

  r_tilted_dir(datum, day, no) {
    let res = this.BNI(datum, day, no) * Math.cos(this.angle_of_incidence(datum, day));
    if (this.debug > 2) console.log('r_tilted_dir: ', res);

    return res > 0 ? res : 0;
  }

  temperature(datum, day, no) {
    var res;
    if (bool_calc_dir_diff_rad) {
      res = this.AmbTempData?.[no];
    } else {
      res = this.AmbTempData?.[no];
    }
    if (this.debug > 1) console.log('temperature: ', res);
    return res;
  }
  r_hor_total(datum, day, no) {
    var res = this.BNI(datum, day, no) + this.r_hor_dif(datum, day, no);
    if (this.debug > 1) console.log('r_hor_total: ', res);
    return res;
  }

  r_hor_dif(datum, day, no) {
    var res;
    if (bool_calc_dir_diff_rad) {
      res = this.DHI(datum, day, no);
    } else {
      res = this.DHIData[no];
    }
    if (this.debug > 1) console.log('r_hor_dif: ', res);
    return res;
  }

  sun_azimuth_rad(datum, day) {
    var res;
    if (this.TLT_hour(datum, day) <= 12) {
      res =
        Math.PI -
        Math.acos(
          (Math.sin(this.sun_elevation_angle_rad(datum, day)) * Math.sin(this.bogenmass(this.lat)) -
            Math.sin(this.declination(datum, day))) /
            (Math.cos(this.sun_elevation_angle_rad(datum, day)) * Math.cos(this.bogenmass(this.lat)))
        );
    } else {
      res =
        Math.PI +
        Math.acos(
          (Math.sin(this.sun_elevation_angle_rad(datum, day)) * Math.sin(this.bogenmass(this.lat)) -
            Math.sin(this.declination(datum, day))) /
            (Math.cos(this.sun_elevation_angle_rad(datum, day)) * Math.cos(this.bogenmass(this.lat)))
        );
    }
    if (this.debug > 1) console.log('sun_azimuth_rad: ', res);
    return res;
  }

  TLT_hour(datum, day) {
    var res = datum.getHours() + 1;
    if (res === 23) res = 0;
    if (this.debug > 2) console.log('TLT_hour: ', res);
    return res;
  }

  declination(datum, day) {
    var res = this.bogenmass(
      0.3948 -
        23.2559 * Math.cos(this.bogenmass(this.j_strich(datum, day) + 9.1)) -
        0.3915 * Math.cos(this.bogenmass(2 * this.j_strich(datum, day) + 5.4)) -
        0.1764 * Math.cos(this.bogenmass(3 * this.j_strich(datum, day) + 26))
    );
    if (this.debug > 2) console.log('declination: ', res);
    return res;
  }

  j_strich(datum, day) {
    var res = (360 * day) / 365;
    if (this.debug > 2) console.log("j': ", res, day);
    return res;
  }

  sun_elevation_angle_grad(datum, day) {
    var res = this.grad(this.sun_elevation_angle_rad(datum, day));
    if (this.debug > 2) console.log('sun_elevation_angle_grad: ', res);
    return res;
  }

  sun_elevation_angle_rad(datum, day, no) {
    var res = Math.asin(
      Math.cos(this.hour_angle_rad(datum, day)) *
        Math.cos(this.declination(datum, day)) *
        Math.cos(this.bogenmass(this.lat)) +
        Math.sin(this.bogenmass(this.lat)) * Math.sin(this.declination(datum, day))
    );
    if (this.debug > 2) console.log('sun_elevation_angle_rad: ', res);
    return res;
  }

  hour_angle_rad(datum, day) {
    var res = this.bogenmass(15 * (12 - this.TLT_min(datum, day) / 60));
    if (this.debug > 2) console.log('hour_angle_rad: ', res);
    return res;
  }

  TLT_min(datum, day) {
    if (this.TLT_adj(datum, day) > 0) {
      return this.TLT_adj(datum, day);
    } else {
      return 24 * 60 + this.TLT_adj(datum, day);
    }
  }

  TLT_adj(datum, day) {
    var res = this.MLT_adj(datum, day) + this.TEQ_min(datum, day);
    if (this.debug > 2) console.log('TLT_adj: ', res);
    return res;
  }

  TEQ_min(datum, day) {
    var res =
      0.0066 +
      7.3525 * Math.cos(this.bogenmass(this.j_strich(datum, day) + 85.9)) +
      9.9359 * Math.cos(this.bogenmass(2 * this.j_strich(datum, day) + 108.9)) +
      0.3387 * Math.cos(this.bogenmass(3 * this.j_strich(datum, day) + 105.2));
    if (this.debug > 2) console.log('TEQ_min: ', res);
    return res;
  }

  MLT_adj(datum, day) {
    var res = this.time_min(datum, day) + 4 * this.lng;
    if (this.debug > 2) console.log('MLT_adj: ', res);
    return res;
  }

  time_min(datum, day) {
    //if (this.debug > 2) console.log('time_min/in: ', datum);
    var res = datum.getHours() * 60 + 30;
    if (this.debug > 2) console.log('time_min: ', res);
    return res;
  }

  angle_of_incidence(datum, day) {
    var res = Math.acos(
      -Math.cos(this.sun_elevation_angle_rad(datum, day)) *
        Math.sin(this.bogenmass(this.roofSlope)) *
        Math.cos(this.sun_azimuth_rad(datum, day) - (this.bogenmass(this.roofDirect) - Math.PI)) +
        Math.sin(this.sun_elevation_angle_rad(datum, day)) * Math.cos(this.bogenmass(this.roofSlope))
    );
    if (this.debug > 2) console.log('angle_of_incidence: ', res);
    return res;
  }

  BNI(datum, day, no) {
    var res;

    if (this.sun_elevation_angle_grad(datum, day) > 1) {
      if (bool_calc_dir_diff_rad && this.sun_elevation_angle_rad(datum, day) > 0) {
        res = this.BHI(datum, day, no) / Math.sin(this.sun_elevation_angle_rad(datum, day));
      } else {
        if (!bool_calc_dir_diff_rad && this.sun_elevation_angle_rad(datum) > 0) {
          res =
            this.beam_horiz_irrad(datum, day, no) / Math.sin(this.sun_elevation_angle_rad(datum, day));
        } else {
          res = 0;
        }
      }
    } else {
      res = this.beam_horiz_irrad(datum, day, no);
    }

    if (this.debug > 1) console.log('BNI: ', res);

    return res;
  }

  beam_horiz_irrad(datum, day, no) {
    var res = this.BHIData[no];
    if (this.debug > 1) console.log('beam_horizontal_irradiation: ', res);
    return res;
  }

  BHI(datum, day, no) {
    var res;
    if (this.GHI(datum, day, no) - this.DHI(datum, day, no) < 0) {
      res = 0;
    } else {
      res = this.GHI(datum, day, no) - this.DHI(datum, day, no);
    }
    if (this.debug > 1) console.log('BHI: ', res);
    return res;
  }

  GHI(datum, day, no) {
    var res = this.GHIData?.[no];
    if (this.debug > 2) console.log('GHI: ', res, no);
    return res;
  }

  DHI(datum, day, no) {
    var res;
    if (this.k_T(datum, day, no) < 0.3 && this.k_T(datum, day, no) >= 0) {
      res = this.GHI(datum, day, no) * (1.02 - 0.249 * this.k_T(datum, day, no));
    } else {
      if (this.k_T(datum, day, no) > 0.3 && this.k_T(datum, day, no) < 0.78) {
        res = this.GHI(datum, day, no) * (1.45 - 1.67 * this.k_T(datum, day, no));
      } else {
        res = this.GHI(datum, day, no) * 0.147;
      }
    }
    if (this.debug > 2) console.log('DHI: ', res, no);
    return res;
  }

  k_T(datum, day, no) {
    var res;
    if (this.GHI(datum, day, no) > 0 && this.I_ex(datum, day, no) > 0) {
      res = this.GHI(datum, day, no) / this.I_ex(datum, day, no);
    } else {
      res = 0;
    }
    if (this.debug > 2) console.log('k_T: ', res);
    return res;
  }

  I_ex(datum, day, no) {
    var res =
      this.adjusted_solar_constant(datum, day, no) *
      Math.sin(this.sun_elevation_angle_rad(datum, day, no));
    if (this.debug > 2) console.log('I_ex: ', res);
    return res;
  }

  adjusted_solar_constant(datum, day, no) {
    var res = const_solar_constant + 48.5 * Math.cos(0.01721 * (day - 15));
    if (this.debug > 2) console.log('adjusted_solar_constant: ', res, day);
    return res;
  }

  day_of_year(date1, date2) {
    const diffInMill = date1 - date2;
    const diffInDays = diffInMill / 1000 / 60 / 60 / 24;
    if (this.debug > 3) console.log('day_of_year: ', diffInDays, Math.floor(diffInDays) + 1, date1);
    return Math.floor(diffInDays) + 1;
  }

  bogenmass(grad) {
    return (grad * Math.PI) / 180;
  }

  grad(radian) {
    return (radian * 180) / Math.PI;
  }
}

export default SolarCalculation;
