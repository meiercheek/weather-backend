const isFloat = (n) => {
    return Number(n) === n && n % 1 !== 0;
}

const checkandcalccoords = (request) => {
    const NElat = request.params.NElat
    const NElong = request.params.NElong
    const SWlat = request.params.SWlat
    const SWlong = request.params.SWlong

    _NElat = null
    _NElong = null
    _SWlat = null
    _SWlong = null

    // lat je x, long je y

    if (isFloat(NElat)) {
        _NElat = NElat
    }
    if (isFloat(NElong)) {
        _NElong = NElong
    }
    if (isFloat(SWlat)) {
        _SWlat = SWlat
    }
    if (isFloat(SWlong)) {
        _SWlong = SWlong
    }

    _SElat = null
    _SElong = null
    _NWlat = null
    _NWlong = null

    if (_NElat != null && _NElong != null && _SWlat != null && _SWlong != null) {
        deltaLat = _NElat - _SWlat
        deltaLong = _NElong - _SWlong

        _NWlong = _SWlong + deltaLong
        _NWlat = _SWlat + deltaLat

        _SElat = _SWlat + deltaLat
        _SElong = _SWlong + deltaLong

        return {
            NElat: _NElat,
            NElong: _NElong,
            NWlat: _NWlat,
            NWlong: _NWlong,
            SElat: _SElat,
            SElong: _SElong,
            SWlat: _SWlat,
            SWlong: _SWlong,
            error: false
        }
    }
    else {
        return {
            NElat: null,
            NElong: null,
            NWlat: null,
            NWlong: null,
            SElat: null,
            SElong: null,
            SWlat: null,
            SWlong: null,
            error: true
        }
    }

}

module.exports = {
    isFloat,
    checkandcalccoords
}