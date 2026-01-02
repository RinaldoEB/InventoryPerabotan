import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const BASE_URL = import.meta.env.VITE_API_URL
  const [listBarang, setListBarang] = useState([])
  const [nama, setNama] = useState("")
  const [jumlah, setJumlah] = useState("")
  const [harga, setHarga] = useState("")
  const [add, setAdd] = useState(false)
  const [edit, setEdit] = useState(false)
  const [editBarang, setEditBarang] = useState({
    id_barang: null,
    nama_barang: "",
    jumlah_barang: null,
    harga_barang: null
  })
  const [search, setSearch] = useState("")

  const handleBarang = async () => {
    const url = `${BASE_URL}/api/barang`
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      const data = await res.json()
      if (!res.ok) return alert(data.message)
      setListBarang(data.data)
    } catch (err) {
      console.error("Fetch error:", err)
    }
  }

  const handleAddBarang = async (e) => {
    e.preventDefault()
    const url = `${BASE_URL}/api/barang`
    const body = {
      nama_barang: nama.trim(),
      jumlah_barang: jumlah.trim(),
      harga_barang: harga.trim()
    }

    if (!nama.trim() || !jumlah.trim() || !harga.trim()) {
      alert("data tidak boleh kosong")
      return
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })

    const data = await res.json()
    if (!res.ok) return alert(data.message)

    alert("Data Berhasil")
    setListBarang(prev => [...prev, data.data])
    setAdd(false)
    setNama("")
    setJumlah("")
    setHarga("")
  }

  const handelAddButton = () => {
    setAdd(true)
    setEdit(false)
  }

  const handleEditBarang = async (e) => {
    e.preventDefault()
    const url = `${BASE_URL}/api/barang/${editBarang.id_barang}`
    const editBody = {
      nama_barang: editBarang.nama_barang.trim(),
      jumlah_barang: Number(editBarang.jumlah_barang),
      harga_barang: Number(editBarang.harga_barang)
    }

    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editBody)
    })

    const data = await res.json()
    if (!res.ok) return alert(data.message)

    alert("data berhasil di ubah")
    setListBarang(prev => prev.map(s => (s.id_barang === data.data.id_barang ? data.data : s)))
    setEdit(false)
  }

  const handleEditButton = (barang) => {
    setEditBarang(barang)
    setEdit(true)
    setAdd(false)
  }

  const handleDeleteBarang = async (id) => {
    if (!window.confirm("apakah benar ingin dihapus ?")) return
    const url = `${BASE_URL}/api/barang/${id}`
    const res = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
    const data = await res.json()
    if (!res.ok) return alert(data.message)
    alert(data.message)
    setListBarang(prev => prev.filter(s => s.id_barang !== id))
  }

  const filterSearch = listBarang.filter(barang =>
    barang.nama_barang.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    handleBarang()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">Daftar Barang Prabotan</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola Stok Barang Perabotan</p>
          </div>
          <button 
            type="button" 
            onClick={handelAddButton} 
            className='bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all active:scale-95 text-center'
          >
            + Tambah Barang
          </button>
        </div>

        {/* Stats & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </span>
            <input 
              type="text"
              value={search}
              placeholder='Cari nama barang...'
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm transition"
            />
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl border border-blue-100 font-semibold flex items-center justify-center">
            Total: {listBarang.length} Item
          </div>
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Barang</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Jumlah</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Opsi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filterSearch.map((barang) => (
                <tr key={barang.id_barang} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{barang.nama_barang}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{barang.jumlah_barang} unit</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Rp {Number(barang.harga_barang).toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 font-medium" onClick={() => handleEditButton(barang)}>Edit</button>
                    <button className="text-red-500 hover:text-red-700 font-medium" onClick={() => handleDeleteBarang(barang.id_barang)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filterSearch.map((barang) => (
            <div key={barang.id_barang} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800 text-lg">{barang.nama_barang}</h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{barang.jumlah_barang} unit</span>
              </div>
              <p className="text-blue-600 font-bold mb-4">Rp {Number(barang.harga_barang).toLocaleString('id-ID')}</p>
              <div className="flex gap-2">
                <button onClick={() => handleEditButton(barang)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-medium">Edit</button>
                <button onClick={() => handleDeleteBarang(barang.id_barang)} className="flex-1 bg-red-50 text-red-500 py-2 rounded-lg font-medium">Hapus</button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filterSearch.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl mt-4 border-2 border-dashed border-gray-100">
            <p className="text-gray-400">Data tidak ditemukan...</p>
          </div>
        )}

        {/* Modals (Add & Edit) */}
        {(add || edit) && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => {setAdd(false); setEdit(false)}}></div>
            <form 
              onSubmit={add ? handleAddBarang : handleEditBarang} 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10 animate-in fade-in zoom-in duration-200"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6">{add ? 'Tambah Barang' : 'Edit Barang'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
                  <input 
                    type="text"
                    value={add ? nama : editBarang.nama_barang}
                    onChange={e => add ? setNama(e.target.value) : setEditBarang({...editBarang, nama_barang: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                    <input 
                      type="number"
                      value={add ? jumlah : editBarang.jumlah_barang}
                      onChange={e => add ? setJumlah(e.target.value) : setEditBarang({...editBarang, jumlah_barang: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                    <input 
                      type="number"
                      value={add ? harga : editBarang.harga_barang}
                      onChange={e => add ? setHarga(e.target.value) : setEditBarang({...editBarang, harga_barang: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-6">
                  <button 
                    type="button" 
                    onClick={() => {setAdd(false); setEdit(false)}}
                    className="px-6 py-2.5 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className={`px-6 py-2.5 text-white font-medium rounded-xl transition ${add ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {add ? 'Simpan Barang' : 'Update Barang'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}

export default App