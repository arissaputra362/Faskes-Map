@extends('layouts.main')

@section('content')
    <div class="app">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-7 col-lg-8 px-0">
                    <div id='map'></div>
                </div>
                <div class="col-md-5 col-lg-4 px-0 app-bar">
                    <div class="card h-100 bg-costum text-light rounded-md-0">
                        <div class="arrow-up d-block d-md-none text-center py-1">
                            <i class="fas fa-angle-up" id="slide-up"></i>
                            <i class="fas fa-angle-down" id="slide-down"></i>
                        </div>
                        <div class="card-body">
                            <a href="/"
                                class="back mb-3 text-decoration-none text-green d-flex align-items-center d-md-inline-block">
                                <i class="fas fa-chevron-circle-left mr-2"></i>
                                <span>Beranda</span>
                            </a>
                            <form>
                                <div class="form-group form-search">
                                    <label for="lokasi">
                                        <h4>Lokasi Anda</h4>
                                    </label>
                                    <div class="form-row">
                                        <div class="col-10">
                                            <input type="hidden" name="latitude" id="latitude">
                                            <input type="hidden" name="longitude" id="longitude">
                                            <input type="text" class="form-control" name="location" id="location"
                                                placeholder="Lokasi Anda saat ini..." readonly>
                                        </div>

                                        <a class="btn text-decoration-none bg-green col-2" onclick="findMe()">
                                            <i class="far fa-dot-circle text-light"></i>
                                        </a>
                                        <small class="ml-2">Find your location by click the button</small>
                                    </div>
                                </div>
                            </form>

                            <div class="mt-4">
                                <h4>Faskes</h4>
                                <ul class="nav nav-tabs" id="myTab" role="tablist">
                                    <li class="nav-item" role="presentation">
                                        <a class="nav-link text-green active" id="close-tab" data-toggle="tab" href="#close"
                                            role="tab" aria-controls="close" aria-selected="true">Terdekat</a>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <a class="nav-link text-green" id="all-tab" data-toggle="tab" href="#all" role="tab"
                                            aria-controls="all" aria-selected="false">Semua</a>
                                    </li>
                                </ul>
                                <div class="tab-content" id="myTabContent">
                                    <div class="tab-pane fade tab-data show active" id="close" role="tabpanel"
                                        aria-labelledby="close-tab">
                                        <ul class="list-group" id="faskes">

                                        </ul>
                                    </div>
                                    <div class="tab-pane fade tab-data" id="all" role="tabpanel" aria-labelledby="all-tab">
                                        <ul class="list-group" id="faskes">
                                            @foreach ($hospitalList as $hospital)
                                                <li class="list-group-item bg-costum"
                                                    onclick="focusOn({{ $hospital->id }})" style="cursor: pointer">
                                                    <b>{{ $hospital->nama }} </b><br>
                                                    {{ $hospital->no ? $hospital->no : '-' }} <br>
                                                    {{ $hospital->alamat }}
                                                </li>
                                            @endforeach
                                        </ul>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
