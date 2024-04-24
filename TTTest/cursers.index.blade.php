{{--@extends('admin.v2.layout')--}}
{{--@section('title', 'Курсы')--}}
{{--@section('h1', 'Курсы')--}}

{{--@section('content')--}}

{{--    <a href="{{ route('admin.courses.create') }}" class="btn btn-primary"><i class="fa fa-plus"></i> Добавить курс</a>--}}
{{--    <br>--}}
{{--    <br>--}}

{{--    <table class="table table-hover" id="coolTable">--}}
{{--                <thead>--}}
{{--        <tr>--}}
{{--            <th scope="col">#</th>--}}
{{--            <th scope="col">Название</th>--}}
{{--            <th scope="col">Школа</th>--}}
{{--            <th scope="col">Статус</th>--}}
{{--            <th scope="col" style="min-width: 100px">Действия</th>--}}
{{--        </tr>--}}
{{--                </thead>--}}
{{--                <tbody>--}}
{{--        @foreach($courses as $item)--}}
{{--            <tr>--}}
{{--                <th scope="row">{{$item->id}}</th>--}}
{{--                <td>{{$item->title}}</td>--}}
{{--                <td>{{$item->school?->name}}</td>--}}
{{--                <td>--}}
{{--                    @if($item->status)--}}
{{--                        <span class="badge badge-success">Вкл</span>--}}
{{--                    @else--}}
{{--                        <span class="badge badge-warning">Выкл</span>--}}
{{--                    @endif--}}
{{--                </td>--}}
{{--                <td>--}}
{{--                    <a href="{{ route('admin.courses.edit',$item->id) }}" class="btn btn-primary btn-sm" title="Редактировать">--}}
{{--                        <i class="fa fa-edit"></i>--}}
{{--                    </a>--}}
{{--                    <form action="{{ route('admin.courses.destroy',$item->id) }}" method="post" class="inline">--}}
{{--                        {{ method_field('DELETE') }}--}}
{{--                        <input type="hidden" name="_token" id="key" value="{{ csrf_token() }}">--}}
{{--                        <button class="btn btn-danger btn-sm rest-destroy" title="Удалить"><i class="fa fa-trash"></i></button>--}}
{{--                    </form>--}}
{{--                </td>--}}
{{--            </tr>--}}
{{--        @endforeach--}}
{{--                </tbody>--}}
{{--    </table>--}}
{{--@endsection--}}


@extends('admin.v2.layout')
@section('title', 'Курсы')
@section('h1', 'Курсы')
<style>
    body {
        font-family: Arial, sans-serif;
        margin: 20px;
    }

    .pagination {
        text-align: center;
    }

    .pagination-buttons {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    button {
        padding: 8px 16px;
        margin: 0 4px;
        cursor: pointer;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .pagination-link {
        display: inline-block;
        padding: 8px 12px;
        margin: 0 4px;
        cursor: pointer;
        background-color: #e0e0e0;
        border-radius: 4px;
        transition: background-color 0.3s;
    }

    .pagination-link:hover {
        background-color: #b0b0b0;
    }
    .pagination-link.active {
        background-color: #3498db;
        color: #fff;
    }


</style>
@section('content')
  <a href="{{ route('admin.courses.create') }}" class="btn btn-primary"><i class="fa fa-plus"></i> Добавить курс</a>
  <br>
  <br>
  <div id="content"></div>

  <div class="pagination-buttons">
    <button id="prevBtn">Previous</button>
    <div class="pagination" id="pagination">
    </div>
    <button id="nextBtn">Next</button>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function () {
      const contentContainer = document.getElementById('content');
      const paginationContainer = document.getElementById('pagination');
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');

      let currentPage = 1;
      let totalPages = 1;
      const perPage = 8;

      updatePage();

      function updatePage() {
        const apiUrl = `https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${perPage}`;

        fetch(apiUrl)
          .then(response => {
            const linkHeader = response.headers.get('Link');
            if (linkHeader) {
              const lastPageMatch = linkHeader.match(/_page=(\d+)&_limit=(\d+)>; rel="last"/);
              if (lastPageMatch) {
                totalPages = parseInt(lastPageMatch[1]);
              }
            }
            return response.json();
          })
          .then(data => {
            contentContainer.innerHTML = '';

            const table = document.createElement('table');
            table.classList.add('table', 'table-hover');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
                    <th scope="col">#</th>
                    <th scope="col">Название</th>
                    <th scope="col">Школа</th>
                    <th scope="col">Статус</th>
                    <th scope="col" style="min-width: 100px">Действия</th>
                `;
            thead.appendChild(headerRow);

            data.forEach(course => {
              const row = document.createElement('tr');
              row.innerHTML = `
                        <th scope="row">${course.id}</th>
                        <td>${course.title}</td>
                        <td>${course.school ? course.school.name : 'AAAsss'}</td>
                        <td>
                            ${course.status ? '<span class="badge badge-success">Вкл</span>' : '<span class="badge badge-warning">Выкл</span>'}
                        </td>
                        <td>
                            <a href="/admin/courses/${course.id}/edit" class="btn btn-primary btn-sm" title="Редактировать">
                                <i class="fa fa-edit"></i>
                            </a>
                            <form action="/admin/courses/${course.id}" method="post" class="inline">
                                {{ method_field('DELETE') }}
              <input type="hidden" name="_token" id="key" value="{{ csrf_token() }}">
                                <button class="btn btn-danger btn-sm rest-destroy" title="Удалить"><i class="fa fa-trash"></i></button>
                            </form>
                        </td>
                    `;
              tbody.appendChild(row);
            });

            table.appendChild(thead);
            table.appendChild(tbody);

            contentContainer.appendChild(table);

            updatePaginationLinks();
          })
          .catch(error => console.error('Error fetching data:', error));
      }

      function updatePaginationLinks() {
        paginationContainer.innerHTML = '';

        const visiblePageCount = 5;
        let startPage = Math.max(1, currentPage - Math.floor(visiblePageCount / 2));
        let endPage = Math.min(totalPages, startPage + visiblePageCount - 1);

        if (endPage < visiblePageCount) {
          startPage = 1;
          endPage = Math.min(totalPages, visiblePageCount);
        }

        for (let i = startPage; i <= endPage; i++) {
          const pageLink = document.createElement('div');
          pageLink.textContent = i;
          pageLink.classList.add('pagination-link');
          if (i === currentPage) {
            pageLink.classList.add('active');
          }
          pageLink.addEventListener('click', function () {
            currentPage = i;
            updatePage();
          });

          paginationContainer.appendChild(pageLink);
        }
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
      }

      prevBtn.addEventListener('click', function () {
        if (currentPage > 1) {
          currentPage--;
          updatePage();
        }
      });
      nextBtn.addEventListener('click', function () {
        if (currentPage < totalPages) {
          currentPage++;
          updatePage();
        }
      });
    });

  </script>
@endsection
