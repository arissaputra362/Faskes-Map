<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Hospital;
use App\Models\PublicHealth;
use App\Models\Road;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HomeController extends Controller
{
    public function index()
    {
        return view('index');
    }

    public function app()
    {
        // Data Faskes
        $hospitals = Hospital::selectRaw('*, st_asgeojson(point) as gjson')->get();

        // Data Wilayah Kota Mojokerto
        $areas = Area::selectRaw('*, st_asgeojson(polygon) as gjson')->get();

        // Data Jalan Sidoarjo
        $roads = Road::selectRaw('*, st_asgeojson(line) as gjson')->get();

        $hospitalData =  [];
        $areaData = [];
        $roadData = [];

        // Create gjson data rumah sakit
        foreach ($hospitals as $hospital) {
            $hospitalData[] = [
                'geometry'      => json_decode($hospital->gjson),
                'type'          => 'Feature',
                'properties'    => [
                    'popupContent' => '<b>' . $hospital->nama . '</b>'
                ],
                'id'            => $hospital->id
            ];
        }

        // Create gjson data jalan
        foreach ($areas as $area) {
            $areaData[] = [
                'geometry'      => json_decode($area->gjson),
                'type'          => 'Feature',
                'properties'    => [
                    'popupContent' => $area->kelurahan . ', ' . $area->kecamatan,
                    'style'        => [
                        json_decode('weight')        => 2,
                        json_decode('color')         => '#999',
                        json_decode('opacity')       => 1,
                        json_decode('fillColor')     => '#b0de5c',
                        json_decode('fillOpacity')   => 0.7
                    ]
                ],
                'id'            => $area->id
            ];
        }

        // Create gjson data jalan
        foreach ($roads as $road) {
            $roadData[] = [
                'geometry'      => json_decode($road->gjson),
                'type'          => 'Feature',
                'properties'    => [
                    'style'        => [
                        json_decode('weight')        => 2,
                        // json_decode('color')         => '#999',
                        // json_decode('opacity')       => 1,
                        json_decode('fillColor')     => '#000',
                        json_decode('fillOpacity')   => 0.1
                    ]
                ],
                'id'            => $road->id
            ];
        }

        return view('app', [
            'hospitalData'      => $hospitalData,
            'areaData'          => $areaData,
            'roadData'          => $roadData,
            'hospitalList'      => $hospitals
        ]);
    }

    public function getLocation(Request $request)
    {
        $myLocation = Area::whereRaw("ST_Contains(polygon, ST_GeomFromText('POINT(" . $request->lng . ' ' . $request->lat . ")'))")->first();

        if ($myLocation) {
            $location = 'Kelurahan ' . $myLocation->kelurahan . ',' .  ' Kecamatan ' . $myLocation->kecamatan;
        } else {
            $location = '-';
        }
        return response()->json(['location' => $location]);
    }

    public function getFaskes()
    {
        $dataFaskes = array();
        $dataJson = json_decode($_GET['data']);

        foreach ($dataJson as $data) {
            $faskes = Hospital::where('id', $data->id)->first();

            $dataFaskes[] = [
                "id"        => $faskes->id,
                "nama"      => $faskes->nama,
                "alamat"    => $faskes->alamat,
                "no"        => $faskes->no,
                "point"     => unpack('x/x/x/x/corder/Ltype/dlat/dlng', $faskes->point),
                "jarak"     => $data->jarak
            ];
        }

        usort($dataFaskes, function ($a, $b) {
            return $a['jarak'] - $b['jarak'];
        });

        return response()->json(['d' => $dataFaskes]);
    }
}
