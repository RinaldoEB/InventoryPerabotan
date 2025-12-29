import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [listBarang, setListBarang] = useState([])
  const [nama,setNama] = useState("")
  const [jumlah,setJumlah] = useState("")
  const [harga,setHarga] = useState("")
  const [add,setAdd] = useState(false)
  const [edit,setEdit] = useState(false)
  const [editBarang,setEditBarang] = useState({
    id_barang: null,
    nama_barang : "",
    jumlah_barang : null,
    harga_barang : null
  })

  const BASE_URL = "http://192.168.0.4:3010"

  const handleBarang = async() => {
    const url = `${BASE_URL}/api/barang`
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await res.json()
    if (!res.ok) {
      return alert(data.message)
    }
    setListBarang(data.data)
  }


  // ! HandleAdd
  const handleAddBarang = async(e) => {
    e.preventDefault()
    const url = `${BASE_URL}/api/barang`
    const body = {
      nama_barang : nama.trim(),
      jumlah_barang : jumlah.trim(),
      harga_barang : harga.trim()
    }

    if(!nama.trim() || !jumlah.trim() || !harga.trim()) {
      alert("data tidak boleh kosong")
      return
    }

    const res = await fetch(url, {
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(body)
    })

    const data = await res.json()

    if(!res.ok) {
      alert(data.message)
      return
    }

    alert("Data Berhasil")
    setListBarang(prev => [...prev, data.data ])
    setAdd(false)
    setNama("")
    setJumlah("")
    setHarga("")

  }
 
  const handelAddButton = () => {
    setAdd(true)
    setEdit(false)
  } 

  // !Handle Edit
  const handleEditBarang = async(e) => {
    e.preventDefault()
    const url = `${BASE_URL}/api/barang/${editBarang.id_barang}`
    const editBody = {
      nama_barang : editBarang.nama_barang.trim(),
      jumlah_barang : Number(editBarang.jumlah_barang),
      harga_barang : Number(editBarang.harga_barang)
    }


    const res = await fetch(url, {
      method : "PUT",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(editBody)
    })

    const data = await res.json()
    
    if(!res.ok) {
      alert(data.message)
    }

    alert("data berhasil di ubah")
    setListBarang(prev => prev.map(s => (s.id_barang === data.data.id_barang ? data.data : s)))
    setEdit(false)
  }

  const handleEditButton = async(barang) => {
    setEditBarang(barang)
    setEdit(true)
    setAdd(false)
  }

  // ! Handle Delete 
  const handleDeleteBarang = async(id) => {
    if(!window.confirm("apakah benar ingin dihapus ?")) {
      return
    }
    const url = `${BASE_URL}/api/barang/${id}`
    const res = await fetch(url, {
      method : "DELETE",
      headers : {
        "Content-Type" : "application/json"
      }
    })
  
    const data = await res.json()

    if(!res.ok) {
      alert(data.message)
      return
    }

    alert(data.message)
    setListBarang(prev => prev.filter(s => s.id_barang !== id))
  }

  useEffect(() => {
    handleBarang()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Inventory Barang</h1>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Total: {listBarang.length} Item
          </span>
          <button type="button" onClick={handelAddButton} className='bg-green-400 text-white px-2 py-2 rounded-xl pointer'>+ Tambah Barang</button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Barang
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opsi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listBarang.map((barang) => (
                <tr key={barang.id_barang} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {barang.nama_barang}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {barang.jumlah_barang} unit
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rp {Number(barang.harga_barang).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={() => handleEditButton(barang)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    
                    <button className="inline-flex items-center px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-md transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" onClick={() => handleDeleteBarang(barang.id_barang)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {listBarang.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-gray-400">
                    Data tidak ditemukan atau sedang memuat...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

       {/* handleAddBarang */}
        {add && (
          <div className="fixed inset-0 z-50">
            {/* Background blur */}
            <div className="absolute inset-0 bg-white-900 bg-opacity-30 backdrop-blur-sm"></div>
            
            {/* Modal */}
            <form onSubmit={handleAddBarang} className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tambah Barang Baru</h2>
                <div className="space-y-4">
                  <input 
                    type="text"
                    value={nama}
                    onChange={e => setNama(e.target.value)} 
                    placeholder='Nama Barang'
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <input 
                    type="number"
                    value={jumlah}
                    onChange={e => setJumlah(e.target.value)}
                    placeholder='Jumlah Barang' 
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <input 
                    type="number"
                    value={harga}
                    onChange={e => setHarga(e.target.value)} 
                    placeholder='Harga Barang'
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <div className="flex justify-end space-x-3 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setAdd(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Batal
                    </button>
                    <input 
                      type="submit" 
                      value="Simpan"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* edit barang */}
        {edit && (
          <div className="fixed inset-0 z-50">
            {/* Background blur */}
            <div className="absolute inset-0 bg-white-900 bg-opacity-30 backdrop-blur-sm"></div>
            
            {/* Modal */}
            <form onSubmit={handleEditBarang} className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Barang</h2>
                <div className="space-y-4">
                  <input 
                    type="text"
                    value={editBarang.nama_barang}
                    onChange={(e) => setEditBarang({...editBarang, nama_barang : e.target.value})}
                    placeholder='Nama Barang'
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <input 
                    type="number"
                    value={editBarang.jumlah_barang}
                    onChange={(e) => setEditBarang({...editBarang, jumlah_barang : e.target.value})}
                    placeholder='Jumlah Barang'
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <input 
                    type="number"
                    value={editBarang.harga_barang}
                    onChange={(e) => setEditBarang({...editBarang, harga_barang : e.target.value})}
                    placeholder='Harga Barang'
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <div className="flex justify-end space-x-3 pt-4">
                    <button 
                      type='button' 
                      onClick={() => setEdit(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Batal
                    </button>
                    <input 
                      type="submit" 
                      value="Update"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition"
                    />
                  </div>
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