#include<bits/stdc++.h>
using namespace std;

// ===== CLASS INFORMASI =====
class Informasi{
    public:
    string nama;
    string alamat;
    string nomor_telepon;
    string jam_operasional;
    string email;
    string rating;

    void setProfil(string nama, string alamat, string nomor_telepon){
        this->nama = nama;
        this->alamat = alamat;
        this->nomor_telepon = nomor_telepon;
    }

    void setJamOperasional(string jam_operasional){
        this->jam_operasional = jam_operasional;
    }

    void setEmail(string email){
        this->email = email;
    }

    void setRating(string rating){
        this->rating = rating;
    }

    void cekInformasi(){
        cout << "===== INFORMASI RESTORAN =====" << endl;
        cout << "Nama: " << nama << endl;
        cout << "Alamat: " << alamat << endl;
        cout << "Nomor Telepon: " << nomor_telepon << endl;
        cout << "Email: " << email << endl;
        cout << "Jam Operasional: " << jam_operasional << endl;
        cout << "Rating: " << rating << endl;
    }
};

// ===== CLASS MENU =====
class Menu{
    public:
    int id;
    string nama_menu;
    string kategori;
    double harga;
    string deskripsi;
    string tag;

    Menu(int id, string nama, string kategori, double harga){
        this->id = id;
        this->nama_menu = nama;
        this->kategori = kategori;
        this->harga = harga;
    }

    Menu(){}

    void setDeskripsi(string deskripsi){
        this->deskripsi = deskripsi;
    }

    void setTag(string tag){
        this->tag = tag;
    }

    void tampilkanMenu(){
        cout << "ID: " << id << endl;
        cout << "Nama Menu: " << nama_menu << endl;
        cout << "Kategori: " << kategori << endl;
        cout << "Harga: Rp " << harga << endl;
        cout << "Deskripsi: " << deskripsi << endl;
        cout << "Tag: " << tag << endl;
    }
};

// ===== CLASS RESERVASI =====
class Reservasi{
    public:
    int id_reservasi;
    string nama;
    string nomor_telepon;
    string email;
    string tanggal;
    string waktu;
    int jumlah_orang;
    string status;

    Reservasi(){}

    Reservasi(int id, string nama, string nomor_telepon, string email, string tanggal, string waktu, int jumlah_orang){
        this->id_reservasi = id;
        this->nama = nama;
        this->nomor_telepon = nomor_telepon;
        this->email = email;
        this->tanggal = tanggal;
        this->waktu = waktu;
        this->jumlah_orang = jumlah_orang;
        this->status = "Pending";
    }

    void setStatus(string status){
        this->status = status;
    }

    void konfirmasiReservasi(){
        cout << "===== DETAIL RESERVASI =====" << endl;
        cout << "ID Reservasi: " << id_reservasi << endl;
        cout << "Nama: " << nama << endl;
        cout << "Telepon: " << nomor_telepon << endl;
        cout << "Email: " << email << endl;
        cout << "Tanggal: " << tanggal << endl;
        cout << "Waktu: " << waktu << endl;
        cout << "Jumlah Orang: " << jumlah_orang << endl;
        cout << "Status: " << status << endl;
    }
};

// ===== CLASS KONTAK =====
class Kontak{
    public:
    string alamat;
    string nomor_telepon;
    string email;
    string jam_buka_weekday;
    string jam_buka_weekend;
    string media_sosial;

    Kontak(string alamat, string telepon, string email){
        this->alamat = alamat;
        this->nomor_telepon = telepon;
        this->email = email;
    }

    Kontak(){}

    void setJamOperasional(string weekday, string weekend){
        this->jam_buka_weekday = weekday;
        this->jam_buka_weekend = weekend;
    }

    void setMediaSosial(string media){
        this->media_sosial = media;
    }

    void tampilkanKontak(){
        cout << "===== INFORMASI KONTAK =====" << endl;
        cout << "Alamat: " << alamat << endl;
        cout << "Nomor Telepon: " << nomor_telepon << endl;
        cout << "Email: " << email << endl;
        cout << "Jam Buka (Weekday): " << jam_buka_weekday << endl;
        cout << "Jam Buka (Weekend): " << jam_buka_weekend << endl;
        cout << "Media Sosial: " << media_sosial << endl;
    }
};

// ===== CLASS RESTAURANT (UTAMA) =====
class Restaurant{
    private:
    Informasi informasi;
    vector<Menu> daftar_menu;
    vector<Reservasi> daftar_reservasi;
    Kontak kontak;

    public:
    Restaurant(){}

    void setInformasi(Informasi info){
        this->informasi = info;
    }

    void tambahMenu(Menu menu){
        daftar_menu.push_back(menu);
    }

    void tambahReservasi(Reservasi reservasi){
        daftar_reservasi.push_back(reservasi);
    }

    void setKontak(Kontak k){
        this->kontak = k;
    }

    void tampilkanSemuaMenu(){
        cout << "===== DAFTAR MENU RESTORAN =====" << endl;
        for(int i = 0; i < daftar_menu.size(); i++){
            cout << "\nMenu ke-" << i+1 << ":" << endl;
            daftar_menu[i].tampilkanMenu();
        }
    }

    void tampilkanReservasi(){
        cout << "===== DAFTAR RESERVASI =====" << endl;
        for(int i = 0; i < daftar_reservasi.size(); i++){
            cout << "\nReservasi ke-" << i+1 << ":" << endl;
            daftar_reservasi[i].konfirmasiReservasi();
        }
    }

    void cariMenuByKategori(string kategori){
        cout << "===== MENU KATEGORI: " << kategori << " =====" << endl;
        for(int i = 0; i < daftar_menu.size(); i++){
            if(daftar_menu[i].kategori == kategori){
                daftar_menu[i].tampilkanMenu();
                cout << endl;
            }
        }
    }

    Informasi getInformasi(){
        return informasi;
    }

    vector<Menu> getMenu(){
        return daftar_menu;
    }

    vector<Reservasi> getReservasi(){
        return daftar_reservasi;
    }
};

class Admin{
    private:
    Restaurant restaurant;

    public:
    Admin(Restaurant r){
        this->restaurant = r;
    }

    void updateInformasi(Informasi info){
        restaurant.setInformasi(info);
    }

    void tambahMenu(Menu menu){
        restaurant.tambahMenu(menu);
    }

    void tambahReservasi(Reservasi reservasi){
        restaurant.tambahReservasi(reservasi);
    }

    void updateKontak(Kontak kontak){
        restaurant.setKontak(kontak);
    }
};

class Customer{
    private:
    Restaurant restaurant;

    public:
    Customer(Restaurant r){
        this->restaurant = r;
    }

    void lihatInformasi(){
        restaurant.getInformasi().cekInformasi();
    }

    void lihatMenu(){
        restaurant.tampilkanSemuaMenu();
    }

    void buatReservasi(Reservasi reservasi){
        restaurant.tambahReservasi(reservasi);
    }
};