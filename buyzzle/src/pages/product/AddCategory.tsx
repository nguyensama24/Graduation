import axios from "axios";
import { useState, useEffect } from "react";
import Container from "../../components/container/Container";

export interface Cate {
  idcategory: number,
  name: string,
  date: string
}

export default function AddCategory() {

  const [category, setCategory] = useState<Cate>({} as Cate);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    
    setCategory({ ...category, name: e.target.value });
  };

  const handleSubmit = () => {
    if (category.idcategory != 0 && category.idcategory != undefined) {
      axios.put(`http://localhost:5000/buyzzle/product/updatecategory/${category.idcategory}`, { name: category.name })
        .then(response => {

          return response
        })
        .then(data => {
          getList()
          setCategory({ name: '', date: '', idcategory: 0 })
        })
        .catch(error => {
          console.error('Error:', error);
          // Xử lý lỗi nếu có

        });
    } else {
      axios.post('http://localhost:5000/buyzzle/product/addcategory', { name: category.name })
        .then(response => {
          return response
        })
        .then(data => {
          getList()
          setCategory({ name: '', date: '', idcategory: 0 })
        })
        .catch(error => {
          console.error('Error:', error);
          // Xử lý lỗi nếu có

        });
    }

  };

  const remove = (id: number) => {
    if (confirm('are you remove item sure!')) {
      axios.delete(`http://localhost:5000/buyzzle/product/deletecategory/${id}`)
        .then(response => {

          return response
        })
        .then(data => {
          getList()
        })
        .catch(error => {
          console.error('Error:', error);
          alert(error)
        });

    }

  };

  const update = (cate: Cate) => {
    setCategory(cate)
  }


  const [categorys, setCategorys] = useState<Cate[]>([])

  useEffect(() => {
    getList()
  }, [])

  const getList = () => {
    fetch("http://localhost:5000/buyzzle/product/allcategory")
      .then((data) => {
        const bien = data.json()
        return bien

      }).then((data) => {
        setCategorys(data)

      }).catch((error) => {
        console.log(error)
      })
  }


  return (
    <>
      <Container>
        <div>
          <div>
            <h1 className="text-[32px] font-bold py-[50px]">THÊM DANH MỤC</h1>
          </div>

          <div className="flex gap-[100px]" >
            <div className="flex flex-col gap-[10px]" >
              <input onChange={handleChange} className="p-[16px] border-[1px] rounded-md border-[#FFAAAF]" value={category.name} type="text" name="name" placeholder="Tên Danh Mục" />
              <button onClick={handleSubmit} type="button" className="p-[16px] text-white border-[1px] rounded-md border-[#FFAAAF] bg-[#00B207]">{category.idcategory == 0 || category.idcategory == undefined ? 'Thêm' : 'Sửa'}</button>
            </div>

            <div>
              {
                categorys.map((e) => {
                  return (

                    <table className="w-[100%]">
                      <tr>
                        <td className="p-[8px] border-[1px] ">{e.idcategory}</td>
                        <td className="p-[8px] border-[1px]">{e.name}</td>
                        <td className="p-[8px] border-[1px]">
                          <button onClick={() => remove(e.idcategory)}>Xóa</button>
                        </td>
                        <td className="p-[8px] border-[1px]">
                          <button onClick={() => update(e)}>Sửa</button>
                        </td>
                      </tr>
                    </table>

                  )
                })
              }

            </div>
          </div>

        </div>


      </Container>
    </>
  )
}
