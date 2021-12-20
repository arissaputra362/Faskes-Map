@extends('layouts.landPage')

@section('content')
    <nav class="navbar py-3 sticky-top navbar-expand-lg navbar-dark">
        <div class="container px-0">
            <a class="navbar-brand mr-0" href="#home">
                Faskmap
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ms-auto navigation">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="#home">Beranda</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="#about">Tentang</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="#feature">Fitur</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <section id="home" class="top-page">
        <div class="container px-md-5">
            <div class="row content">
                <div class="col-md-5 my-auto">
                    <div class="headline">
                        Ketahui Fasilitas <br class="d-none d-md-block">
                        Kesehatan Di sekitar Anda
                    </div>
                    <div class="subheadline mt-4">
                        Ketahuilah Fasilitas Kesehatan di sekitar anda<br class="d-none d-md-block">
                        tanpa perlu repot untuk mencari secara langsung
                    </div>
                    <div class="button-header">
                        <a href="/app" class="btn btn-started">Mulai Sekarang</a>
                        <button class="btn btn-watch">Tentang Kami</button>
                    </div>
                </div>
                <div class="col-md-7 mt-5 mt-md-0">
                    <div class="img-container p-2">
                        <img src="img/top-img.png" alt="header" class="img-fluid">
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section id="about" class="top-page">
        <div class="container px-md-5">
            <div class="row content">
                <div class="col-md-6 mt-5 mt-md-0">
                    <div class="img-second-page d-flex justify-content-center align-items-center m-5 p-2">
                        <img src="icon/pin.png" alt="header" class="img-fluid">
                    </div>
                </div>
                <div class="col-md-6 my-auto">
                    <div class="headline">
                        About Faskmap
                    </div>
                    <div class="subheadline mt-4">
                        Faskmap (Faskes Map) adalah sebuah web aplikasi informasi geografis yang bertujuan untuk memudahkan
                        pengguna dalam mencari Fasilitas Kesehatan di sekitar lokasinya di dalam Kota Mojokerto. Dengan
                        menampilkan hampir semua data fasilitas kesehatan yang ada di Kota Mojokerto dan menampilkan daftar
                        fasilitas kesehatan dengan radius 1km dari lokasi pengguna, serta juga menunjukkan rute untuk menuju
                        salah satu
                        faskes yg dituju.
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="feature" class="adventages">
        <div class="container">
            <div class="row mx-0 text-center d-block">
                <div class="headline">
                    Kita Berikan Cara Termudah Untuk<br />
                    <span class="cl-light-blue font-red-hat-display">Mencari Fasilitas Kesehatan</span>
                </div>
            </div>
            <div class="value row mx-0 d-flex justify-content-center justify-content-md-between">
                <div class="card">
                    <div class="card-body p-0">
                        <div class="img-container p-3">
                            <img src="img/user-loc.png" alt="dolar" class="img-fluid" />
                        </div>
                        <div class="card-desc">
                            <h4 class="card-title">Klik dan Geser</h4>
                            <p class="card-text">
                                Klik dan Geser pin untuk menyesuaikan lokasi Anda.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body p-0">
                        <div class="img-container p-3">
                            <img src="img/find.png" alt="dolar" class="img-fluid" />
                        </div>
                        <div class="card-desc">
                            <h4 class="card-title">Faskes Radius 1km</h4>
                            <p class="card-text">
                                Menampilkan data Fasilitas Kesehatan dengan radius 1km dari pengguna.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body p-0">
                        <div class="img-container p-3">
                            <img src="img/rute.png" alt="dolar" class="img-fluid" />
                        </div>
                        <div class="card-desc">
                            <h4 class="card-title">Menunjukkan Rute</h4>
                            <p class="card-text">
                                Tunjukkan rute jalan untuk menuju ke Fasilitas Kesehatan yang ingin dituju.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="ornament">
        <div class="d-flex justify-content-start">
            <img src="http://api.elements.buildwithangga.com/storage/files/2/assets/Content/Content10/dark/Ornament-left.png"
                alt="ornament" class="ornament-left img-fluid d-none d-md-block" />
        </div>
    </section>

    <section class="contact-us">
        <div class="container">
            <div class="row d-block mx-0">
                <div class="headline font-red-hat-display px-5 mx-lg-5">
                    Cari Fasilitas Kesehatan Didekatmu Dengan Mudah Di Sini
                </div>
            </div>
            <div class="row mx-0 button text-center">
                <div class="col-md-12 text-md-center mb-4 mb-md-0">
                    <a href="/app" class="btn btn-contact">Go to App</a>
                </div>
            </div>
        </div>
    </section>

    <footer class="page-footer font-small blue py-5 text-white">
        <div class="container-fluid text-md-left">
            <div class="row">
                <div class="col-md-4 mt-md-0 mt-3">
                    <h3 class="font-weight-bold mb-4">Faskmap</h3>
                    <p class="mb-2">Ketahui Fasilitas</p>
                    <p>Kesehatan Di dekatmu</p>
                </div>
                <hr class="clearfix w-100 d-md-none pb-3" />
                <div class="row col-md-8">
                    <div class="col-md-6 col-sm-6 mb-md-0 mb-3">
                        <p class="text-white font-weight-bold mb-4">Ours</p>
                        <ul class="list-unstyled">
                            <li>
                                <a href="#home" class="text-decoration-none">Beranda</a>
                            </li>
                            <li>
                                <a href="#about" class="text-decoration-none">Tentang Kami</a>
                            </li>
                            <li>
                                <a href="#feature" class="text-decoration-none">Private company</a>
                            </li>
                        </ul>
                    </div>
                    <div class="col-md-6 col-sm-6 mb-md-0 mb-3">
                        <p class="text-white font-weight-bold mb-4">Product</p>
                        <ul class="list-unstyled">
                            <li>
                                <a href="/app" class="text-decoration-none">Application</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </footer>
@endsection
